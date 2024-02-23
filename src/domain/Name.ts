export class Name {
  constructor(readonly value: string) {
    if (!this.isValidName(value)) throw new Error('Invalid name')
  }

  isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/)
  }
}
