import * as d3 from "d3";
import { Telemetry, TimerStatus } from "@milkdown/ctx";

type TimeLine = {
  name: string;
  start: number;
  end: number;
  color: ReturnType<typeof d3.color>;
  status: TimerStatus;
};

const getTimelineData = (inspector: Telemetry[]): TimeLine[] => {
  const points = inspector
    .filter((inspection) => inspection.recordedTimers.length > 0)
    .flatMap(({ recordedTimers, waitTimers }) =>
      recordedTimers.map((timer) => ({
        ...timer,
        waitFor: waitTimers,
      }))
    )
    .filter(
      (item, index, arr) => arr.findIndex((x) => x.name === item.name) === index
    );

  const startIndex = points.findIndex((point) => point.waitFor.length === 0);
  if (startIndex < 0) return [];
  let ps = [...points];
  const mapping: Record<string, TimeLine> = {};

  function loop() {
    const deps = ps.filter((point) => {
      return point.waitFor.every((x) => mapping[x.name] != null);
    });
    if (deps.length === 0) {
      console.error("Cannot resolve dependencies for current list: ", ps);
      return [];
    }
    deps.forEach((point) => {
      const ends = point.waitFor.map((x) => {
        const { end } = mapping[x.name];
        return end;
      });
      const end = Math.max(0, ...ends);
      mapping[point.name] = {
        name: point.name.endsWith("Ready")
          ? point.name.slice(0, -5)
          : point.name,
        start: end,
        end: end + point.duration,
        status: point.status,
        color: d3.color(
          point.status === "resolved"
            ? "#A3BE8C"
            : point.status === "rejected"
            ? "#BF616A"
            : "#EBCB8B"
        )!,
      };
    });
    ps = ps.filter((point) => !deps.includes(point));
    if (ps.length > 0) {
      loop();
    }
  }
  loop();

  return Object.values(mapping).sort((a, b) => a.start - b.start);
};

function getSvg(width: number, height: number) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", [0, 0, width, height] as never);
  svg.setAttribute("width", width as never);
  svg.setAttribute("height", height as never);
  return svg;
}

function createTooltip(
  el: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  darkMode: boolean
) {
  el.style("position", "absolute")
    .style("pointer-events", "none")
    .style("top", 0)
    .style("opacity", 0)
    .style("background", !darkMode ? "white" : "black")
    .style("border-radius", "5px")
    .style("box-shadow", "0 0 10px rgba(0,0,0,.25)")
    .style("padding", "10px")
    .style("line-height", "1.3")
    .style("font", "11px sans-serif");
}

export const renderTimeline = (
  container: HTMLDivElement,
  inspector: Telemetry[],
  darkMode: boolean
) => {
  const data = getTimelineData(inspector);

  const height = 200;
  const width = Math.floor(container.getBoundingClientRect().width);
  const svg = getSvg(width, height);
  const margin = { top: 30, right: 30, bottom: 30, left: 30 };
  const root = d3.select(svg);
  const g = root
    .append("g")
    .attr("transform", (d, i) => `translate(${margin.left} ${margin.top})`);

  const timeLines = g
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "line");

  const tooltip = d3
    .select(document.createElement("div"))
    .call(createTooltip, darkMode);

  const line = root
    .append("line")
    .attr("y1", margin.top - 10)
    .attr("y2", height - margin.bottom)
    .attr("stroke", "rgba(0,0,0,0.2)")
    .style("pointer-events", "none");

  const getX = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.start),
      d3.max(data, (d) => d.end),
    ] as number[])
    .range([0, width - margin.left - margin.right]);

  const getY = d3
    .scaleBand()
    .domain(d3.range(data.length) as never)
    .range([0, height - margin.bottom - margin.top])
    .padding(0.2);

  timeLines.attr("transform", (d, i) => `translate(0 ${getY(i as never)})`);

  timeLines
    .each(function (d) {
      const el = d3.select(this);
      const x = getX(d.start);
      const w = getX(d.end) - getX(d.start);
      const y = getY.bandwidth();
      const textWidth = 100;
      const isLabelRight =
        x > width / 2
          ? x + w < width - textWidth
          : x - w > 0 || x + w > width - textWidth;

      el.style("cursor", "pointer");

      el.append("rect")
        .attr("x", x)
        .attr("height", y)
        .attr("width", w)
        .attr("fill", d.color as never);

      el.append("text")
        .text(d.name)
        .attr("x", isLabelRight ? x - 5 : x + w + 5)
        .attr("y", 2.5)
        .style("text-anchor", isLabelRight ? "end" : "start")
        .style("dominant-baseline", "hanging");
    })
    .on("mouseover", function (_, d) {
      d3.select(this)
        .select("rect")
        .attr(
          "fill",
          darkMode ? (d.color.brighter() as never) : (d.color.darker() as never)
        );

      tooltip.style("opacity", 1).html(() => {
        return `<b>${d.name}</b><br/><b style="color:${
          darkMode ? d.color.brighter() : d.color.darker()
        }">${d.start}ms - ${d.end}ms</b>`;
      });
    })
    .on("mouseleave", function (_, d) {
      d3.select(this)
        .select("rect")
        .attr("fill", d.color as never);
      tooltip.style("opacity", 0);
    });

  const axisTop = d3
    .axisTop(getX)
    .tickPadding(2)
    .tickFormat((d) => `${d}ms`);

  root
    .append("g")
    .attr("transform", (d, i) => `translate(${margin.left} ${margin.top - 10})`)
    .call(axisTop);

  root.on("mousemove", function (e, d) {
    let [x, y] = d3.pointer(e, d);
    line.attr("transform", `translate(${x} 0)`);
    y += 20;
    if (x > width / 2) x -= 100;

    tooltip.style("left", x + "px").style("top", y + "px");
  });

  container.appendChild(root.node()!);
  container.appendChild(tooltip.node()!);
};
