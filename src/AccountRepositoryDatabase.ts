import { Account } from './Account'
import { AccountRepository } from './AccountRepository'
import { DatabaseConnection } from './DatabaseConnection'
export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async save(account: Account): Promise<void> {
    await this.databaseConnection.query(
      'insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values (?, ?, ?, ?, ?, ?, ?)',
      [
        account.accountId,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
      ],
    )
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const [account] = await this.databaseConnection.query(
      'select * from account where account_id = ?',
      [accountId],
    )
    if (!account) return
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.car_plate,
      !!account.is_passenger,
      !!account.is_driver,
    )
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const [account] = await this.databaseConnection.query(
      'select * from account where email = ?',
      [email],
    )
    if (!account) return
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.car_plate,
      !!account.is_passenger,
      !!account.is_driver,
    )
  }
}
