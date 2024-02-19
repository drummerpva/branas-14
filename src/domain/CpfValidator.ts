export function validateCpf(cpf: string) {
  if (!cpf) return false
  cpf = clean(cpf)
  if (!isValidLength(cpf)) return false
  if (allDigitsAreEqual(cpf)) return false
  const dg1 = calculateDigit(cpf, 10)
  const dg2 = calculateDigit(cpf, 11)
  return extractCheckDigit(cpf) === `${dg1}${dg2}`
}

function clean(cpf: string) {
  return cpf.replace(/\D/g, '')
}

function isValidLength(cpf: string) {
  return cpf.length === 11
}

function allDigitsAreEqual(cpf: string) {
  return cpf.split('').every((c) => c === cpf[0])
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0
  for (const digit of cpf) {
    if (factor < 2) break
    total += Number(digit) * factor--
  }
  const rest = total % 11
  return rest < 2 ? 0 : 11 - rest
}

function extractCheckDigit(cpf: string) {
  return cpf.slice(9)
}
