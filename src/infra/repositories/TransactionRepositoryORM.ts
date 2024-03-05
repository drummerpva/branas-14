import { TransactionRepository } from '../../application/repositories/TransactionRepository'
import { Transaction } from '../../domain/Transaction'
import { DatabaseConnection } from '../database/DatabaseConnection'
import { ORM } from '../orm/ORM'
import { TransactionModel } from '../orm/TransactionModel'

export class TransactionRepositoryORM implements TransactionRepository {
  orm: ORM
  constructor(readonly connection: DatabaseConnection) {
    this.orm = new ORM(connection)
  }

  async save(transaction: Transaction): Promise<void> {
    const transactionModel = TransactionModel.fromEntity(transaction)
    await this.orm.save(transactionModel)
  }

  async getByRideId(rideId: string): Promise<Transaction> {
    const transactionModel = await this.orm.get(
      TransactionModel,
      'ride_id',
      rideId,
    )
    return transactionModel?.getEntity()
  }
}
