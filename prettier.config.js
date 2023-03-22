module.exports = {
  plugins: [
    require("@trivago/prettier-plugin-sort-imports"),
    require("prettier-plugin-tailwindcss"),
  ],
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
};
