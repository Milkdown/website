const isAbbreviation = (str: string) => {
  return ["api", "faq", "gfm"].includes(str.toLowerCase());
};

const isConjunction = (str: string) => {
  return ["and", "or", "with", "for"].includes(str.toLowerCase());
};

const isExample = (str: string) => {
  if (str.toLowerCase() === "example") {
    return true;
  }
  return false;
};

export const toTitle = (id: string) =>
  id
    .split("-")
    .map((str) =>
      isAbbreviation(str)
        ? str.toUpperCase()
        : isConjunction(str)
          ? str.toLowerCase()
          : isExample(str)
            ? "Ex."
            : str.charAt(0).toUpperCase() + str.slice(1),
    )
    .join(" ");
