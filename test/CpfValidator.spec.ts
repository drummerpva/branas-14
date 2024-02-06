import { validateCpf } from '../src/CpfValidator'

test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve testar CPFs válidos',
  (cpf: string) => {
    const isValid = validateCpf(cpf)
    expect(isValid).toBe(true)
  },
)
test.each(['', undefined, null, '11111111111', '111', '11111111111111'])(
  'Deve testar CPFs inválidos',
  (cpf: any) => {
    const isValid = validateCpf(cpf)
    expect(isValid).toBe(false)
  },
)
