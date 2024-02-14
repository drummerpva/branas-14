import { Account } from './Account'

export interface SignupAccountDAO {
  save(account: Account): Promise<void>
  getByEmail(email: string): Promise<any>
}
