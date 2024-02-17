import mysql from 'mysql2/promise'
import { Account } from './Account'
import { AccountRepository } from './AccountRepository'
export class AccountRepositoryDatabase implements AccountRepository {
  async save(account: Account): Promise<void> {
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    await connection.query(
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
    connection.pool.end()
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    const [[account]] = (await connection.query(
      'select * from account where account_id = ?',
      [accountId],
    )) as any[]
    connection.pool.end()
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
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    const [[account]] = (await connection.query(
      'select * from account where email = ?',
      [email],
    )) as any[]
    connection.pool.end()
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
