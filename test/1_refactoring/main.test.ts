import { getAccount, signup } from '../../src/1_refactoring/main'

test.each(['98765432100', '97456321558', '71428793860'])(
  'Deve criar uma conta para o passageiro',
  async (cpf: string) => {
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    }

    const outputSignup = await signup(inputSignup)
    const outputGetAccount = await getAccount(outputSignup.accountId)

    expect(outputSignup.accountId).toBeDefined()
    expect(outputGetAccount.name).toBe(inputSignup.name)
    expect(outputGetAccount.email).toBe(inputSignup.email)
    expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  },
)

test('Deve criar uma conta para o motorista', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isDriver: true,
    password: '123456',
    carPlate: 'ABC1234',
  }

  const outputSignup = await signup(inputSignup)
  const outputGetAccount = await getAccount(outputSignup.accountId)

  expect(outputSignup.accountId).toBeDefined()
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  expect(outputGetAccount.car_plate).toBe(inputSignup.carPlate)
})

test('Não deve criar uma conta se o nome for inválido', async () => {
  const inputSignup = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }

  expect(() => signup(inputSignup)).rejects.toThrow('Invalid name')
})

test('Não deve criar uma conta se o email for inválido', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }

  expect(() => signup(inputSignup)).rejects.toThrow('Invalid email')
})

test.each(['', '123', '11111111111', null, undefined])(
  'Não deve criar uma conta se o cpf for inválido',
  async (cpf: any) => {
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    }

    expect(() => signup(inputSignup)).rejects.toThrow('Invalid cpf')
  },
)

test('Não deve criar uma conta se o email for duplicado', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  await signup(inputSignup)
  expect(() => signup(inputSignup)).rejects.toThrow('Duplicated account')
})

test('Não deve criar uma conta se a placa for inválida', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isDriver: true,
    password: '123456',
    carPlate: '',
  }
  expect(() => signup(inputSignup)).rejects.toThrow('Invalid car plate')
})
