import { Signup } from '../src/Signup'
import { Logger } from '../src/Logger'
import { AccountDAODatabase } from '../src/AccountDAODatabase'
import { LoggerConsole } from '../src/LoggerConsole'
import { SignupAccountDAO } from '../src/SignupAccountDAO'
import { RequestRide } from '../src/RequestRide'
import { RideDAO } from '../src/RideDAO'
import { GetRide } from '../src/GetRide'
import { RideDAODatabase } from '../src/RideDAODatabase'

let signup: Signup
let AccountDAO: SignupAccountDAO
let logger: Logger
let rideDAO: RideDAO
let requestRide: RequestRide
let getRide: GetRide

beforeEach(() => {
  AccountDAO = new AccountDAODatabase()
  logger = new LoggerConsole()
  signup = new Signup(AccountDAO, logger)
  rideDAO = new RideDAODatabase()
  requestRide = new RequestRide(rideDAO, logger)
  getRide = new GetRide(rideDAO, logger)
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
  expect(outputGetRide.passenger_id).toBe(inputRequestRide.passengerId)
})
