import { signup } from '../../src/1_refactoring/main'

test('Deve criar uma conta para o passageiro', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '98765432100',
    idPassenger: true,
    password: '123456',
  }

  const outputSignup = await signup(inputSignup)
  expect(outputSignup.accountId).toBeDefined()
})
