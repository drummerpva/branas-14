import { CarPlate } from '../../src/domain/CarPlate'

test('Deve criar uma placa de carro válida', () => {
  const carPlate = new CarPlate('ABC1234')
  expect(carPlate).toBeDefined()
  expect(carPlate.value).toBe('ABC1234')
})
test('Não deve criar uma placa de carro inválida', () => {
  expect(() => new CarPlate('AC134')).toThrow('Invalid car plate')
})
