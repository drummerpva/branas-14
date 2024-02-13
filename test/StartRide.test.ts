import { Signup } from '../src/Signup'
import { Logger } from '../src/Logger'
import { AccountDAODatabase } from '../src/AccountDAODatabase'
import { LoggerConsole } from '../src/LoggerConsole'
import { RequestRide } from '../src/RequestRide'
import { RideDAO } from '../src/RideDAO'
import { GetRide } from '../src/GetRide'
import { RideDAODatabase } from '../src/RideDAODatabase'
import { AccountDAO } from '../src/AccountDAO'
import { AcceptRide } from '../src/AcceptRide'
import { StartRide } from '../src/StartRide'

let signup: Signup
let accountDAO: AccountDAO
let logger: Logger
let rideDAO: RideDAO
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide

beforeEach(() => {
  accountDAO = new AccountDAODatabase()
  logger = new LoggerConsole()
  signup = new Signup(accountDAO, logger)
  rideDAO = new RideDAODatabase()
  requestRide = new RequestRide(rideDAO, accountDAO, logger)
  getRide = new GetRide(rideDAO, logger)
  acceptRide = new AcceptRide(rideDAO, accountDAO, logger)
  startRide = new StartRide(rideDAO, accountDAO, logger)
})

test('Deve iniciar uma corrida', async () => {
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
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  }
  await startRide.execute(inputStartRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('in_progress')
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId)
})
