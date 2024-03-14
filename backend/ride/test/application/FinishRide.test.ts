import { LoggerConsole } from '../../src/infra/logger/LoggerConsole'
import { RequestRide } from '../../src/application/usecases/RequestRide'
import { AcceptRide } from '../../src/application/usecases/AcceptRide'
import { StartRide } from '../../src/application/usecases/StartRide'
import { RideRepository } from '../../src/application/repositories/RideRepository'
import { RideRepositoryDatabase } from '../../src/infra/repositories/RideRepositoryDatabase'
import { DatabaseConnection } from '../../src/infra/database/DatabaseConnection'
import { MysqlAdapter } from '../../src/infra/database/MysqlAdapter'
import { Logger } from '../../src/application/logger/Logger'
import { PositionRepository } from '../../src/application/repositories/PositionRepository'
import { UpdatePosition } from '../../src/application/usecases/UpdatePosition'
import { PositionRepositoryDatabase } from '../../src/infra/repositories/PositionRepositoryDatabase'
import { FinishRide } from '../../src/application/usecases/FinishRide'
import { AccountGateway } from '../../src/application/gateway/AccountGateway'
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp'
import { PaymentGateway } from '../../src/application/gateway/PaymentGateway'
import { PaymentGatewayHttp } from '../../src/infra/gateway/PaymentGatewayHttp'
import { Queue } from '../../src/infra/queue/Queue'
import { GetRideQuery } from '../../src/application/query/GetRideQuery'

let logger: Logger
let rideRepository: RideRepository
let requestRide: RequestRide
let getRide: GetRideQuery
let acceptRide: AcceptRide
let startRide: StartRide
let databaseConnection: DatabaseConnection
let positionRepository: PositionRepository
let updatePosition: UpdatePosition
let finishRide: FinishRide
let acccountGateway: AccountGateway
let paymentGateway: PaymentGateway
let queue: Queue

beforeEach(() => {
  databaseConnection = new MysqlAdapter()
  logger = new LoggerConsole()
  rideRepository = new RideRepositoryDatabase(databaseConnection)
  positionRepository = new PositionRepositoryDatabase(databaseConnection)
  acccountGateway = new AccountGatewayHttp()
  paymentGateway = new PaymentGatewayHttp()
  requestRide = new RequestRide(rideRepository, acccountGateway, logger)
  // getRide = new GetRideAPIComposition(rideRepository, acccountGateway)
  getRide = new GetRideQuery(databaseConnection)
  acceptRide = new AcceptRide(rideRepository, acccountGateway, logger)
  startRide = new StartRide(rideRepository, logger)
  updatePosition = new UpdatePosition(
    rideRepository,
    positionRepository,
    logger,
  )
  queue = new Queue()
  // queue = {
  //   consume: async () => {},
  //   publish: async () => {},
  // }
  finishRide = new FinishRide(rideRepository, paymentGateway, logger, queue)
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
  const outputSignupPassenger =
    await acccountGateway.signup(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver = {
    name: 'John Doe Driver',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isDriver: true,
    carPlate: 'ABC1234',
    password: '123456',
  }
  const outputSignupDriver = await acccountGateway.signup(inputSignupDriver)
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
  expect(outputGetRide.fare).toBe(50)
  // expect(outputGetRide.fare).toBe(21)
  expect(outputGetRide.passengerName).toBe('John Doe')
  expect(outputGetRide.passengerCpf).toBe('98765432100')
  expect(outputGetRide.driverCarPlate).toBe('ABC1234')
})
