import { randomUUID } from 'crypto'
import { MysqlAdapter } from '../../src/infra/database/MysqlAdapter'
import { TransactionModel } from '../../src/infra/orm/TransactionModel'
import { ORM } from '../../src/infra/orm/ORM'

test('Deve testar o ORM', async () => {
  const transactionId = randomUUID()
  const rideId = randomUUID()

  const transactionModel = new TransactionModel(
    transactionId,
    rideId,
    100,
    new Date(),
    'waiting_payment',
  )
  const connection = new MysqlAdapter()
  const orm = new ORM(connection)
  await orm.save(transactionModel)
  const saveTransactionModel = await orm.get(
    TransactionModel,
    'transaction_id',
    transactionId,
  )
  expect(saveTransactionModel.transactionId).toBe(transactionId)
  expect(saveTransactionModel.rideId).toBe(rideId)
  expect(saveTransactionModel.amount).toBe(100)
  expect(saveTransactionModel.status).toBe('waiting_payment')
  await connection.close()
})
