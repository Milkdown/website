import { Telemetry } from "@milkdown/ctx";
import * as d3 from "d3";
import { uid } from "./uid";

const treemap = (data: any, width: number, height: number) =>
  d3
    .treemap()
    .size([width, height])
    .paddingOuter(3)
    .paddingTop(19)
    .paddingInner(1)
    .round(true)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      // @ts-ignore
      .sort((a, b) => b.value - a.value)
  );

const transformScope = (scope: string) =>
  scope.startsWith("@milkdown/")
    ? scope.slice(10).replace(/plugin-/, "@")
    : scope;

const getTreemapData = (inspector: Telemetry[]) => {
  const map: Record<string, any> = {};
  inspector.forEach((inspection) => {
    const scope = transformScope(inspection.metadata.package);
    const group = inspection.metadata.group;

    if (!map[scope]) {
      map[scope] = {
        name: scope,
      };
    }

    if (group) {
      if (!map[scope].children) {
        map[scope].children = [];
      }
      // @ts-ignore
      const has = map[scope].children.find((x) => x.name === group);
      if (!has) {
        map[scope].children.push({
          name: group,
          value: inspector.filter(
            (x) =>
              transformScope(x.metadata.package) === scope &&
              x.metadata.group === group
          ).length,
        });
      }

      return;
    }

    if (!map[scope].value) {
      map[scope].value = inspector.filter(
        (x) => transformScope(x.metadata.package) === scope
      ).length;
    }
  });

  return {
    name: "editor",
    children: Object.values(map),
  };
};

const format = d3.format(",d");

const color = d3.scaleSequential([8, 0], d3.interpolateMagma);

export function renderTreemap(
  container: HTMLDivElement,
  inspector: Telemetry[]
) {
  const treemapData = getTreemapData(inspector);
  container.style.marginLeft = "30px";
  container.style.marginRight = "30px";
  const width = Math.floor(container.getBoundingClientRect().width);
  const height = 400;
  const root = treemap(treemapData, width, height);

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  const shadow = uid("shadow");

  svg
    .append("filter")
    .attr("id", shadow.id)
    .append("feDropShadow")
    .attr("flood-opacity", 0.3)
    .attr("dx", 0)
    .attr("stdDeviation", 3);

  const node = svg
    .selectAll("g")
    .data(d3.group(root, (d) => d.height))
    .join("g")
    // @ts-ignore
    .attr("filter", shadow)
    .selectAll("g")
    .data((d) => d[1])
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  node.append("title").text(
    (d) =>
      `${d
        .ancestors()
        .reverse()
        // @ts-ignore
        .map((d) => d.data.name)
        // @ts-ignore
        .join("/")}\n${format(d.value)}`
  );

  node
    .append("rect")
    // @ts-ignore
    .attr("id", (d) => (d.nodeUid = uid("node")).id)
    .attr("fill", (d) => color(d.height))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  node
    .append("clipPath")
    // @ts-ignore
    .attr("id", (d) => (d.clipUid = uid("clip")).id)
    .append("use")
    // @ts-ignore
    .attr("href", (d) => d.nodeUid.href);

  node
    .append("text")
    // @ts-ignore
    .attr("clip-path", (d) => d.clipUid)
    .selectAll("tspan")
    // @ts-ignore
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
    .join("tspan")
    .attr("fill-opacity", (d, i, nodes) =>
      i === nodes.length - 1 ? 0.7 : null
    )
    // @ts-ignore
    .text((d) => d);

  node
    // @ts-ignore
    .filter((d) => d.children)
    .selectAll("tspan")
    .attr("dx", 3)
    .attr("y", 13);

  node
    .filter((d) => !d.children)
    .selectAll("tspan")
    .attr("x", 3)
    .attr(
      "y",
      // @ts-ignore
      (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
    );

  container.appendChild(svg.node()!);
}
