import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { MainController } from './infra/controller/MainController'
import { Registry } from './infra/di/Registry'
import { ProcessPayment } from './application/usecases/ProcessPayment'
import { TransactionRepositoryORM } from './infra/repositories/TransactionRepositoryORM'
import { MysqlAdapter } from './infra/database/MysqlAdapter'
import { GetTransactionByRideId } from './application/usecases/GetTransactionByRideId'
import { QueueController } from './infra/queue/QueueController'
import { Queue } from './infra/queue/Queue'

const httpServer = new ExpressAdapter()
const registry = Registry.getInstance()
const databaseConnection = new MysqlAdapter()
const queue = new Queue()
const transactionRepository = new TransactionRepositoryORM(databaseConnection)
const processPayment = new ProcessPayment(transactionRepository, queue)
const getTransactionByRideId = new GetTransactionByRideId(transactionRepository)
registry.register('httpServer', httpServer)
registry.register('queue', queue)
registry.register('httpServer', httpServer)
registry.register('processPayment', processPayment)
registry.register('getTransactionByRideId', getTransactionByRideId)
new MainController()
new QueueController()
httpServer.listen(3002)
