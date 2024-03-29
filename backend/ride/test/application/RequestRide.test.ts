import { LoggerConsole } from '../../src/infra/logger/LoggerConsole'
import { RequestRide } from '../../src/application/usecases/RequestRide'
import { GetRide } from '../../src/application/usecases/GetRide'
import { randomUUID } from 'node:crypto'
import { RideRepository } from '../../src/application/repositories/RideRepository'
import { RideRepositoryDatabase } from '../../src/infra/repositories/RideRepositoryDatabase'
import { DatabaseConnection } from '../../src/infra/database/DatabaseConnection'
import { MysqlAdapter } from '../../src/infra/database/MysqlAdapter'
import { Logger } from '../../src/application/logger/Logger'
import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { FetchAdapter } from '../../src/infra/http/FetchAdapter'
import { HttpClient } from '../../src/infra/http/HttpClient'

let logger: Logger
let rideRepository: RideRepository
let requestRide: RequestRide
let getRide: GetRide
let databaseConnection: DatabaseConnection
let accountGateway: AccountGateway
let httpClient: HttpClient

beforeEach(() => {
  databaseConnection = new MysqlAdapter()
  logger = new LoggerConsole()
  rideRepository = new RideRepositoryDatabase(databaseConnection)
  // httpClient = new AxiosAdapter()
  httpClient = new FetchAdapter()
  accountGateway = new AccountGatewayHttp(httpClient)
  requestRide = new RequestRide(rideRepository, accountGateway, logger)
  getRide = new GetRide(rideRepository, logger)
})
afterEach(async () => {
  await databaseConnection.close()
})

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
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId)
  expect(outputGetRide.status).toBe('requested')
})
test('Não deve poder solicitar uma corrida se a conta não for de um passageiro', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
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
  await expect(() =>
    requestRide.execute(inputRequestRide),
  ).rejects.toThrowError('Only passenger can request a ride')
})
test('Não deve poder solicitar uma corrida se a conta não existir', async () => {
  const inputRequestRide = {
    passengerId: randomUUID(),
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  await expect(() =>
    requestRide.execute(inputRequestRide),
  ).rejects.toThrowError('Account does not exist')
})
test('Não deve poder solicitar uma corrida se o passageiro já tiver outra corrida ativa', async () => {
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
  await requestRide.execute(inputRequestRide)
  await expect(() =>
    requestRide.execute(inputRequestRide),
  ).rejects.toThrowError('Passenger has an active ride')
})
