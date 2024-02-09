import sinon from 'sinon'
import { GetAccount } from '../src/GetAccount'
import { Signup } from '../src/Signup'
import { Logger } from '../src/Logger'
import { AccountDAODatabase } from '../src/AccountDAODatabase'
import { AccountDAO } from '../src/AccountDAO'
import { LoggerConsole } from '../src/LoggerConsole'

let signup: Signup
let getAccount: GetAccount
let accountDAO: AccountDAO
let logger: Logger

beforeEach(() => {
  accountDAO = new AccountDAODatabase()
  logger = new LoggerConsole()
  signup = new Signup(accountDAO, logger)
  getAccount = new GetAccount(accountDAO)
})

test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve criar uma conta para o passageiro (STUB)',
  async function (cpf: string) {
    sinon.stub(AccountDAODatabase.prototype, 'save').resolves()
    sinon.stub(AccountDAODatabase.prototype, 'getByEmail').resolves(null)
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
    sinon.stub(AccountDAODatabase.prototype, 'getById').resolves(inputSignup)
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    // then
    expect(outputGetAccount.name).toBe(inputSignup.name)
    expect(outputGetAccount.email).toBe(inputSignup.email)

    sinon.restore()
  },
)
test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve criar uma conta para o passageiro (MOCK)',
  async function (cpf: string) {
    const mockLogger = sinon.mock(LoggerConsole.prototype)
    mockLogger.expects('log').withArgs('Signup John Doe').once()
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
    expect(outputGetAccount.name).toBe(inputSignup.name)
    expect(outputGetAccount.email).toBe(inputSignup.email)
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
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(loggerSpy.calledOnce).toBe(true)
  expect(loggerSpy.calledWith(`Signup ${inputSignup.name}`)).toBe(true)
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
    const accountDAOFake: AccountDAO = {
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
    const signup = new Signup(accountDAOFake, loggerFake)
    const getAccount = new GetAccount(accountDAOFake)

    const outputSignup = await signup.execute(inputSignup)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup.accountId)
    expect(outputGetAccount.name).toBe(inputSignup.name)
    expect(outputGetAccount.email).toBe(inputSignup.email)
  },
)
