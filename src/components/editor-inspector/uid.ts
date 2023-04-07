let count = 0;

export function uid(name: string) {
  return new Id("O-" + (name == null ? "" : name + "-") + ++count);
}

class Id {
  id: string;
  href: string;

  constructor(id: string) {
    this.id = id;
    // @ts-ignore
    this.href = new URL(`#${id}`, location).toString();
  }

  toString() {
    return "url(" + this.href + ")";
  }
}
