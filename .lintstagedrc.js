module.exports = {
  '*.{js,jsx,ts,tsx}': ['oxlint -c .oxlintrc.json --fix', 'oxfmt --write'],
}
