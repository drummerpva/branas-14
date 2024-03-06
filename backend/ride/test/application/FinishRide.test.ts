import { Signup } from '../../src/application/usecases/Signup'
import { LoggerConsole } from '../../src/infra/logger/LoggerConsole'
import { RequestRide } from '../../src/application/usecases/RequestRide'
import { GetRide } from '../../src/application/usecases/GetRide'
import { AcceptRide } from '../../src/application/usecases/AcceptRide'
import { StartRide } from '../../src/application/usecases/StartRide'
import { AccountRepository } from '../../src/application/repositories/AccountRepository'
import { AccountRepositoryDatabase } from '../../src/infra/repositories/AccountRepositoryDatabase'
import { RideRepository } from '../../src/application/repositories/RideRepository'
import { RideRepositoryDatabase } from '../../src/infra/repositories/RideRepositoryDatabase'
import { DatabaseConnection } from '../../src/infra/database/DatabaseConnection'
import { MysqlAdapter } from '../../src/infra/database/MysqlAdapter'
import { Logger } from '../../src/application/logger/Logger'
import { PositionRepository } from '../../src/application/repositories/PositionRepository'
import { UpdatePosition } from '../../src/application/usecases/UpdatePosition'
import { PositionRepositoryDatabase } from '../../src/infra/repositories/PositionRepositoryDatabase'
import { FinishRide } from '../../src/application/usecases/FinishRide'
import { TransactionRepository } from '../../src/application/repositories/TransactionRepository'
import { TransactionRepositoryORM } from '../../src/infra/repositories/TransactionRepositoryORM'

let signup: Signup
let accountRepository: AccountRepository
let logger: Logger
let rideRepository: RideRepository
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let databaseConnection: DatabaseConnection
let transctionRepository: TransactionRepository
let positionRepository: PositionRepository
let updatePosition: UpdatePosition
let finishRide: FinishRide

beforeEach(() => {
  databaseConnection = new MysqlAdapter()
  accountRepository = new AccountRepositoryDatabase(databaseConnection)
  logger = new LoggerConsole()
  signup = new Signup(accountRepository, logger)
  rideRepository = new RideRepositoryDatabase(databaseConnection)
  positionRepository = new PositionRepositoryDatabase(databaseConnection)
  requestRide = new RequestRide(rideRepository, accountRepository, logger)
  transctionRepository = new TransactionRepositoryORM(databaseConnection)
  getRide = new GetRide(rideRepository, transctionRepository, logger)
  acceptRide = new AcceptRide(rideRepository, accountRepository, logger)
  startRide = new StartRide(rideRepository, accountRepository, logger)
  updatePosition = new UpdatePosition(
    rideRepository,
    positionRepository,
    logger,
  )
  finishRide = new FinishRide(rideRepository, positionRepository, logger)
})
afterEach(async () => {
  await databaseConnection.close()
})

test('Deve atualizar localização e calcular distância percorrida', async () => {
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
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
  }
  await updatePosition.execute(inputUpdatePosition1)
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }
  await updatePosition.execute(inputUpdatePosition2)

  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  }
  await finishRide.execute(inputFinishRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('completed')
  expect(outputGetRide.distance).toBe(10)
  expect(outputGetRide.fare).toBe(21)
})