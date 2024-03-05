import { Cpf } from '../../src/domain/Cpf'

test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve testar CPFs válidos',
  (cpf: string) => {
    const cpfVO = new Cpf(cpf)
    expect(cpfVO).toBeDefined()
  },
)
test.each(['', undefined, null, '11111111111', '111', '11111111111111'])(
  'Deve testar CPFs inválidos',
  (cpf: any) => {
    expect(() => new Cpf(cpf)).toThrow('Invalid cpf')
  },
)
