import crypto from 'node:crypto'
import { validateCpf } from './CpfValidator'
import { Logger } from './Logger'
import { SignupAccountDAO } from './SignupAccountDAO'

export class Signup {
  constructor(
    private accountDAO: SignupAccountDAO,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`Signup ${input.name}`)
    input.accountId = crypto.randomUUID()
    const account = await this.accountDAO.getByEmail(input.email)
    if (account) throw new Error('Duplicated account')
    if (!this.isValidName(input.name)) throw new Error('Invalid name')
    if (!this.isValidEmail(input.email)) throw new Error('Invalid email')
    if (!validateCpf(input.cpf)) throw new Error('Invalid cpf')
    if (input.isDriver && !this.isValidCarPlate(input.carPlate))
      throw new Error('Invalid car plate')
    await this.accountDAO.save(input)
    return {
      accountId: input.accountId,
    }
  }

  isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/)
  }

  isValidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/)
  }

  isValidCarPlate(carPlate: string) {
    return carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}
