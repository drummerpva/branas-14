import { Email } from '../../src/domain/Email'

test('Deve criar um email válido', () => {
  const email = new Email('john@doe.com')
  expect(email).toBeDefined()
  expect(email.value).toBe('john@doe.com')
})
test('Não deve criar um email inválido', () => {
  expect(() => new Email('john')).toThrow('Invalid email')
})
