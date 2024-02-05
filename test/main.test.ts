import axios from 'axios'
axios.defaults.validateStatus = () => true

test.each(['98765432100', '97456321558', '71428793860'])(
  'Deve criar uma conta para o passageiro pela API',
  async (cpf: string) => {
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    }

    const responseSignup = await axios.post(
      'http://localhost:3000/signup',
      inputSignup,
    )
    const outputSignup = responseSignup.data
    const responseGetAccount = await axios.get(
      `http://localhost:3000/accounts/${outputSignup.accountId}`,
    )
    const outputGetAccount = responseGetAccount.data
    expect(outputSignup.accountId).toBeDefined()
    expect(outputGetAccount.name).toBe(inputSignup.name)
    expect(outputGetAccount.email).toBe(inputSignup.email)
    expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  },
)

test('Deve criar uma conta para o motorista via API', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isDriver: true,
    password: '123456',
    carPlate: 'ABC1234',
  }

  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    inputSignup,
  )
  const outputSignup = responseSignup.data
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`,
  )
  const outputGetAccount = responseGetAccount.data

  expect(outputSignup.accountId).toBeDefined()
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf)
  expect(outputGetAccount.car_plate).toBe(inputSignup.carPlate)
})

test('Não deve criar uma conta se o nome for inválido via API', async () => {
  const inputSignup = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    inputSignup,
  )
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data
  expect(outputSignup.message).toBe('Invalid name')
})

test('Não deve criar uma conta se o email for inválido via API', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }

  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    inputSignup,
  )
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data
  expect(outputSignup.message).toBe('Invalid email')
})

test.each(['', '123', '11111111111', null, undefined])(
  'Não deve criar uma conta se o cpf for inválido via API',
  async (cpf: any) => {
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    }

    const responseSignup = await axios.post(
      'http://localhost:3000/signup',
      inputSignup,
    )
    expect(responseSignup.status).toBe(422)
    const outputSignup = responseSignup.data
    expect(outputSignup.message).toBe('Invalid cpf')
  },
)

test('Não deve criar uma conta se o email for duplicado via API', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isPassenger: true,
    password: '123456',
  }
  await axios.post('http://localhost:3000/signup', inputSignup)
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    inputSignup,
  )
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data
  expect(outputSignup.message).toBe('Duplicated account')
})

test('Não deve criar uma conta se a placa for inválida via API', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    isDriver: true,
    password: '123456',
    carPlate: '',
  }
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    inputSignup,
  )
  expect(responseSignup.status).toBe(422)
  const outputSignup = responseSignup.data
  expect(outputSignup.message).toBe('Invalid car plate')
})
