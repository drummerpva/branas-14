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
  expect(account.name.value).toBe('John Doe')
  expect(account.email.value).toBe('john.doe@gmail.com')
  expect(account.cpf.value).toBe('98765432100')
})
