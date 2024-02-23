import sinon from 'sinon'
import { GetAccount } from '../../src/application/usecases/GetAccount'
import { Signup } from '../../src/application/usecases/Signup'
import { LoggerConsole } from '../../src/infra/logger/LoggerConsole'
import { AccountRepositoryDatabase } from '../../src/infra/repositories/AccountRepositoryDatabase'
import { AccountRepository } from '../../src/application/repositories/AccountRepository'
import { Account } from '../../src/domain/Account'
import { DatabaseConnection } from '../../src/infra/database/DatabaseConnection'
import { MysqlAdapter } from '../../src/infra/database/MysqlAdapter'
import { Logger } from '../../src/application/logger/Logger'

let signup: Signup
let getAccount: GetAccount
let accountRepository: AccountRepository
let logger: Logger
let databaseConnection: DatabaseConnection

beforeEach(() => {
  databaseConnection = new MysqlAdapter()
  accountRepository = new AccountRepositoryDatabase(databaseConnection)
  logger = new LoggerConsole()
  signup = new Signup(accountRepository, logger)
  getAccount = new GetAccount(accountRepository)
})
afterEach(async () => {
  await databaseConnection.close()
})

test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve criar uma conta para o passageiro (STUB)',
  async function (cpf: string) {
    sinon.stub(AccountRepositoryDatabase.prototype, 'save').resolves()
    sinon
      .stub(AccountRepositoryDatabase.prototype, 'getByEmail')
      .resolves(undefined)
    // given
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    }
    // when
    const outputSignup = await signup.execute(inputSignup)
    expect(outputSignup.accountId).toBeDefined()
    const returnAccont = Account.create(
      inputSignup.name,
      inputSignup.email,
      inputSignup.cpf,
      '',
      inputSignup.isPassenger,
      false,
    )
    sinon
      .stub(AccountRepositoryDatabase.prototype, 'getById')
      .resolves(returnAccont)
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    // then
    expect(outputGetAccount?.name).toBe(inputSignup.name)
    expect(outputGetAccount?.email).toBe(inputSignup.email)

    sinon.restore()
  },
)
test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve criar uma conta para o passageiro (MOCK)',
  async function (cpf: string) {
    const mockLogger = sinon.mock(LoggerConsole.prototype)
    mockLogger.expects('log').withArgs('Signup').once()
    // given
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    }
    // when
    const outputSignup = await signup.execute(inputSignup)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    // then
    expect(outputGetAccount?.name).toBe(inputSignup.name)
    expect(outputGetAccount?.email).toBe(inputSignup.email)
    mockLogger.verify()

    sinon.restore()
  },
)

test('Não deve criar uma conta se o nome for inválido', async function () {
  // given
  const inputSignup = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    password: '123456',
  }
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error('Invalid name'),
  )
})

test('Não deve criar uma conta se o email for inválido', async function () {
  // given
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '97456321558',
    isPassenger: true,
    password: '123456',
  }
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error('Invalid email'),
  )
})

test.each(['', undefined, null, '11111111111', '111', '11111111111111'])(
  'Não deve criar uma conta se o cpf for inválido',
  async function (cpf: any) {
    // given
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    }
    // when
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(
      new Error('Invalid cpf'),
    )
  },
)

test('Não deve criar uma conta se o email for duplicado', async function () {
  // given
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    password: '123456',
  }
  // when
  await signup.execute(inputSignup)
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error('Duplicated account'),
  )
})

test('Deve criar uma conta para o motorista (SPY)', async function () {
  const loggerSpy = sinon.spy(LoggerConsole.prototype, 'log')
  // given
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true,
    password: '123456',
  }
  // when
  const outputSignup = await signup.execute(inputSignup)
  const outputGetAccount = await getAccount.execute(outputSignup.accountId)
  // then
  expect(outputSignup.accountId).toBeDefined()
  expect(outputGetAccount?.name).toBe(inputSignup.name)
  expect(outputGetAccount?.email).toBe(inputSignup.email)
  expect(loggerSpy.calledOnce).toBe(true)
  expect(loggerSpy.calledWith(`Signup`)).toBe(true)
  sinon.restore()
})

test('Não deve criar uma conta para o motorista com a placa inválida', async function () {
  // given
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'AAA999',
    isPassenger: false,
    isDriver: true,
    password: '123456',
  }
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error('Invalid car plate'),
  )
})
test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve criar uma conta para o passageiro (FAKE)',
  async function (cpf: string) {
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    }
    const accounts: any[] = []
    const accountRepositoryFake: AccountRepository = {
      save: async (account: any) => {
        accounts.push(account)
      },
      getById: async (accountId: string) => {
        return accounts.find((account) => account.accountId === accountId)
      },
      getByEmail: async (email: string) =>
        accounts.find((account) => account.email === email),
    }
    const loggerFake: Logger = {
      log: async () => {},
    }
    const signup = new Signup(accountRepositoryFake, loggerFake)
    const getAccount = new GetAccount(accountRepositoryFake)

    const outputSignup = await signup.execute(inputSignup)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount?.name).toBe(inputSignup.name)
    expect(outputGetAccount?.email).toBe(inputSignup.email)
  },
)
