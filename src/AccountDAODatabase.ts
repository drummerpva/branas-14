import mysql from 'mysql2/promise'
import { SignupAccountDAO } from './SignupAccountDAO'
import { GetAccountAccountDAO } from './GetAccountAccountDAO'
export class AccountDAODatabase
  implements SignupAccountDAO, GetAccountAccountDAO
{
  async save(account: any): Promise<void> {
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

  async getById(accountId: string): Promise<any> {
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    const [[account]] = (await connection.query(
      'select * from account where account_id = ?',
      [accountId],
    )) as any[]
    connection.pool.end()
    return account
  }

  async getByEmail(email: string): Promise<any> {
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    const [[account]] = (await connection.query(
      'select * from account where email = ?',
      [email],
    )) as any[]
    connection.pool.end()
    return account
  }
}
