import { Transaction } from '../../domain/Transaction'

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>
}
