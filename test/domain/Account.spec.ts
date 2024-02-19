import { Account } from '../../src/domain/Account'

test('Deve criar uma conta', () => {
  const account = Account.create(
    'John Doe',
    'john.doe@gmail.com',
    '98765432100',
    '',
    true,
    false,
  )
  expect(account.accountId).toBeDefined()
  expect(account.name).toBe('John Doe')
  expect(account.email).toBe('john.doe@gmail.com')
  expect(account.cpf).toBe('98765432100')
})
