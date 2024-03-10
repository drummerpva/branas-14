import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { RideRepository } from '../../src/application/repositories/RideRepository'
import { GetRideByPassengerId } from '../../src/application/usecases/GetRideByPassengerId'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import axios from 'axios'
import { setTimeout as sleep } from 'node:timers/promises'
import { RideRepositoryDatabase } from '../../src/infra/repositories/RideRepositoryDatabase'
import { DatabaseConnection } from '../../src/infra/database/DatabaseConnection'
import { MysqlAdapter } from '../../src/infra/database/MysqlAdapter'
import { Logger } from '../../src/application/logger/Logger'
import { LoggerConsole } from '../../src/infra/logger/LoggerConsole'

let accountGateway: AccountGateway
let databaseConnection: DatabaseConnection
let rideRepository: RideRepository
let logger: Logger
let getRideByPassengerId: GetRideByPassengerId

beforeEach(() => {
  databaseConnection = new MysqlAdapter()
  logger = new LoggerConsole()
  rideRepository = new RideRepositoryDatabase(databaseConnection)
  getRideByPassengerId = new GetRideByPassengerId(rideRepository, logger)
  accountGateway = new AccountGatewayHttp()
})
afterEach(async () => {})

test('Deve solicitar uma corrida', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  const outputSignup = await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  await axios.post('http://localhost:3000/request_ride_async', inputRequestRide)
  await sleep(200)
  const outputGetRide = await getRideByPassengerId.execute(
    outputSignup.accountId,
  )
  expect(outputGetRide.status).toBe('requested')
})
