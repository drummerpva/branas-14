import { Account } from './Account'

export interface GetAccountAccountDAO {
  getById(accountId: string): Promise<Account>
}
