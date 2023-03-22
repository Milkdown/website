export const toTitle = (id: string) => {
  const tmp = id.split("-").join(" ");
  return tmp.charAt(0).toUpperCase() + tmp.slice(1);
};
