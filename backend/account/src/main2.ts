import { AccountRepositoryDatabase } from './infra/repositories/AccountRepositoryDatabase'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { GetAccount } from './application/usecases/GetAccount'
import { MainController } from './infra/controller/MainController'
import { MysqlAdapter } from './infra/database/MysqlAdapter'
import { Signup } from './application/usecases/Signup'
import { Registry } from './infra/di/Registry'
import { LoggerDecorator } from './application/decorator/LoggerDecorator'

const databaseConnection = new MysqlAdapter()
const httpServer = new ExpressAdapter()
const accountRepository = new AccountRepositoryDatabase(databaseConnection)
const signup = new LoggerDecorator(new Signup(accountRepository))
const getAccount = new GetAccount(accountRepository)
const registry = Registry.getInstance()
registry.register('httpServer', httpServer)
registry.register('signup', signup)
registry.register('getAccount', getAccount)
new MainController()
httpServer.listen(3004)
