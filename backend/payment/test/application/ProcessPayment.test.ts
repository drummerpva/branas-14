import { randomUUID } from 'crypto'
import { MysqlAdapter } from '../../src/infra/database/MysqlAdapter'
import { TransactionRepositoryORM } from '../../src/infra/repositories/TransactionRepositoryORM'
import { ProcessPayment } from '../../src/application/usecases/ProcessPayment'
import { GetTransactionByRideId } from '../../src/application/usecases/GetTransactionByRideId'

test('Deve processar um pagamento', async () => {
  const connection = new MysqlAdapter()
  const transactionRepository = new TransactionRepositoryORM(connection)
  const processPayment = new ProcessPayment(transactionRepository)
  const rideId = randomUUID()
  const inputProcessPayment = {
    rideId,
    creditCardToken: '123456789',
    amount: 100,
  }
  await processPayment.execute(inputProcessPayment)
  const getTransactionByRideId = new GetTransactionByRideId(
    transactionRepository,
  )
  const output = await getTransactionByRideId.execute(rideId)
  expect(output.rideId).toBe(rideId)
  expect(output.amount).toBe(100)
  expect(output.status).toBe('paid')
  await connection.close()
})
