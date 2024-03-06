import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { LoggerConsole } from './infra/logger/LoggerConsole'
import { MainController } from './infra/controller/MainController'
import { MysqlAdapter } from './infra/database/MysqlAdapter'
import { Registry } from './infra/di/Registry'

const databaseConnection = new MysqlAdapter()
const httpServer = new ExpressAdapter()
const logger = new LoggerConsole()
const registry = Registry.getInstance()
registry.register('httpServer', httpServer)
new MainController()
httpServer.listen(3000)
