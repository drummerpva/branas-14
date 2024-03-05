import { Name } from '../../src/domain/Name'

test('Deve testar um nome válido', () => {
  const name = new Name('John Doe')
  expect(name).toBeDefined()
  expect(name.value).toBe('John Doe')
})
test('Não Deve criar um nome inválido', () => {
  expect(() => new Name('John')).toThrow('Invalid name')
})
