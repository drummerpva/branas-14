import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { LoggerConsole } from './infra/logger/LoggerConsole'
import { MainController } from './infra/controller/MainController'
import { MysqlAdapter } from './infra/database/MysqlAdapter'
import { Registry } from './infra/di/Registry'
import { Queue } from './infra/queue/Queue'
import { SendReceipt } from './application/usecases/SendReceipt'
import { QueueController } from './infra/queue/QueueController'
import { RequestRide } from './application/usecases/RequestRide'
import { RideRepositoryDatabase } from './infra/repositories/RideRepositoryDatabase'
import { AccountGatewayHttp } from './infra/gateway/AccountGatewayHttp'
import { UpdateRideProjection } from './application/usecases/UpdateRideProjection'

const databaseConnection = new MysqlAdapter()
const httpServer = new ExpressAdapter()
const logger = new LoggerConsole()
const registry = Registry.getInstance()
const queue = new Queue()
const sendReceipt = new SendReceipt()
const rideRepository = new RideRepositoryDatabase(databaseConnection)
const accountGateway = new AccountGatewayHttp()
const requestRide = new RequestRide(rideRepository, accountGateway, logger)
const updateRideProjection = new UpdateRideProjection(databaseConnection)
registry.register('httpServer', httpServer)
registry.register('queue', queue)
registry.register('sendReceipt', sendReceipt)
registry.register('requestRide', requestRide)
registry.register('updateRideProjection', updateRideProjection)
new MainController()
new QueueController()
httpServer.listen(3000)
