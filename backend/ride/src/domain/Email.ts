export class Email {
  constructor(readonly value: string) {
    if (!this.isValidEmail(value)) throw new Error('Invalid email')
  }

  isValidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/)
  }
}
