import { Account } from '../../domain/Account'
import { Logger } from '../logger/Logger'
import { AccountRepository } from '../repositories/AccountRepository'

export class Signup {
  constructor(
    private accountRepository: AccountRepository,
    private logger: Logger,
  ) {}

  async execute(input: Input): Promise<Output> {
    this.logger.log(`Signup ${input.name}`)
    const existingAccount = await this.accountRepository.getByEmail(input.email)
    if (existingAccount) throw new Error('Duplicated account')
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate ?? '',
      !!input.isPassenger,
      !!input.isDriver,
    )
    await this.accountRepository.save(account)
    return {
      accountId: account.accountId,
    }
  }
}

type Input = {
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger?: boolean
  isDriver?: boolean
  password: string
}
type Output = {
  accountId: string
}
