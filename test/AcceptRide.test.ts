import { Signup } from '../src/Signup'
import { Logger } from '../src/Logger'
import { LoggerConsole } from '../src/LoggerConsole'
import { RequestRide } from '../src/RequestRide'
import { RideDAO } from '../src/RideDAO'
import { GetRide } from '../src/GetRide'
import { RideDAODatabase } from '../src/RideDAODatabase'
import { AcceptRide } from '../src/AcceptRide'
import { AccountRepository } from '../src/AccountRepository'
import { AccountRepositoryDatabase } from '../src/AccountRepositoryDatabase'

let signup: Signup
let accountDAO: AccountRepository
let logger: Logger
let rideDAO: RideDAO
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide

beforeEach(() => {
  accountDAO = new AccountRepositoryDatabase()
  logger = new LoggerConsole()
  signup = new Signup(accountDAO, logger)
  rideDAO = new RideDAODatabase()
  requestRide = new RequestRide(rideDAO, accountDAO, logger)
  getRide = new GetRide(rideDAO, logger)
  acceptRide = new AcceptRide(rideDAO, accountDAO, logger)
})

test('Deve aceitar uma corrida', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  const outputSignupPassenger = await signup.execute(inputSignupPassenger)
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
  const outputSignupDriver = await signup.execute(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('accepted')
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId)
})
test('Não deve aceitar uma corrida se a conta não for de um motorista', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  const outputSignupPassenger = await signup.execute(inputSignupPassenger)
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
  const outputSignupDriver = await signup.execute(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrowError(
    'Only drivers can accept ride',
  )
})
