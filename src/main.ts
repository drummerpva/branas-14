import { AccountRepositoryDatabase } from './infra/repositories/AccountRepositoryDatabase'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { GetAccount } from './application/usecases/GetAccount'
import { LoggerConsole } from './infra/gateway/LoggerConsole'
import { MainController } from './infra/controller/MainController'
import { MysqlAdapter } from './infra/database/MysqlAdapter'
import { Signup } from './application/usecases/Signup'

const databaseConnection = new MysqlAdapter()
const httpServer = new ExpressAdapter()
const accountRepository = new AccountRepositoryDatabase(databaseConnection)
const logger = new LoggerConsole()
const signup = new Signup(accountRepository, logger)
const getAccount = new GetAccount(accountRepository)
new MainController(httpServer, signup, getAccount)
httpServer.listen(3000)
