const isAbbreviation = (str: string) => {
  return ["api", "faq"].includes(str.toLowerCase());
};

const isConjunction = (str: string) => {
  return ["and", "or", "with", "for"].includes(str.toLowerCase());
};

export const toTitle = (id: string) =>
  id
    .split("-")
    .map((str) =>
      isAbbreviation(str)
        ? str.toUpperCase()
        : isConjunction(str)
        ? str.toLowerCase()
        : str.charAt(0).toUpperCase() + str.slice(1)
    )
    .join(" ");
