import { LoggerConsole } from '../../src/infra/logger/LoggerConsole'
import { RequestRide } from '../../src/application/usecases/RequestRide'
import { GetRide } from '../../src/application/usecases/GetRide'
import { AcceptRide } from '../../src/application/usecases/AcceptRide'
import { RideRepository } from '../../src/application/repositories/RideRepository'
import { RideRepositoryDatabase } from '../../src/infra/repositories/RideRepositoryDatabase'
import { MysqlAdapter } from '../../src/infra/database/MysqlAdapter'
import { DatabaseConnection } from '../../src/infra/database/DatabaseConnection'
import { Logger } from '../../src/application/logger/Logger'
import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { FetchAdapter } from '../../src/infra/http/FetchAdapter'

let logger: Logger
let rideRepository: RideRepository
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let databaseConnection: DatabaseConnection
let accountGateway: AccountGateway

beforeEach(() => {
  databaseConnection = new MysqlAdapter()
  logger = new LoggerConsole()
  rideRepository = new RideRepositoryDatabase(databaseConnection)
  const httpClient = new FetchAdapter()
  accountGateway = new AccountGatewayHttp(httpClient)
  requestRide = new RequestRide(rideRepository, accountGateway, logger)
  getRide = new GetRide(rideRepository, logger)
  acceptRide = new AcceptRide(rideRepository, accountGateway, logger)
})
afterEach(async () => {
  await databaseConnection.close()
})

test('Deve aceitar uma corrida', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isDriver: true,
    carPlate: 'ABC1234',
    password: '123456',
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('accepted')
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId)
})
test('Não deve aceitar uma corrida se a conta não for de um motorista', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    carPlate: 'ABC1234',
    password: '123456',
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrowError(
    'Only drivers can accept ride',
  )
})
