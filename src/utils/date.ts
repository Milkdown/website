export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
