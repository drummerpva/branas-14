import sinon from 'sinon'
import { GetAccount } from '../src/GetAccount'
import { Signup } from '../src/Signup'
import { AccountDAO } from '../src/AccountDAO'
import { Logger } from '../src/Logger'

let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
  signup = new Signup()
  getAccount = new GetAccount()
})

test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve criar uma conta para o passageiro (STUB)',
  async function (cpf: string) {
    sinon.stub(AccountDAO.prototype, 'save').resolves()
    sinon.stub(AccountDAO.prototype, 'getByEmail').resolves(null)
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
    sinon.stub(AccountDAO.prototype, 'getById').resolves(inputSignup)
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
    const mockLogger = sinon.mock(Logger.prototype)
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
  const loggerSpy = sinon.spy(Logger.prototype, 'log')
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
