import { Signup } from '../src/Signup'
import { Logger } from '../src/Logger'
import { LoggerConsole } from '../src/LoggerConsole'
import { RequestRide } from '../src/RequestRide'
import { GetRide } from '../src/GetRide'
import { randomUUID } from 'node:crypto'
import { AccountRepository } from '../src/AccountRepository'
import { AccountRepositoryDatabase } from '../src/AccountRepositoryDatabase'
import { RideRepository } from '../src/RideRepository'
import { RideRepositoryDatabase } from '../src/RideRepositoryDatabase'

let signup: Signup
let accountRepository: AccountRepository
let logger: Logger
let rideRepository: RideRepository
let requestRide: RequestRide
let getRide: GetRide

beforeEach(() => {
  accountRepository = new AccountRepositoryDatabase()
  logger = new LoggerConsole()
  signup = new Signup(accountRepository, logger)
  rideRepository = new RideRepositoryDatabase()
  requestRide = new RequestRide(rideRepository, accountRepository, logger)
  getRide = new GetRide(rideRepository, logger)
})

test('Deve solicitar uma corrida', async () => {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  const outputSignup = await signup.execute(inputSignupPassenger)
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
  const outputSignup = await signup.execute(inputSignupPassenger)
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
  const outputSignup = await signup.execute(inputSignupPassenger)
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
