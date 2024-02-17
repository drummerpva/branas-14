import { Account } from './Account'
import { AccountRepository } from './AccountRepository'
import { Logger } from './Logger'

export class Signup {
  constructor(
    private accountRepository: AccountRepository,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`Signup ${input.name}`)
    const existingAccount = await this.accountRepository.getByEmail(input.email)
    if (existingAccount) throw new Error('Duplicated account')
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      input.isPassenger,
      input.isDriver,
    )
    await this.accountRepository.save(account)
    return {
      accountId: account.accountId,
    }
  }
}
