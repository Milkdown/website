export const toTitle = (id: string) =>
  id
    .split("-")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
