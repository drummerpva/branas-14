import crypto from 'node:crypto'
import mysql from 'mysql2/promise'

export function validateCpf(cpf: string) {
  if (!cpf) return false
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length !== 11) return false
  if (cpf.split('').every((c) => c === cpf[0])) return false
  let d1 = 0
  let d2 = 0
  let dg1 = 0
  let dg2 = 0
  let rest = 0
  let nDigResult = ''
  for (let nCount = 1; nCount < cpf.length - 1; nCount++) {
    const digito = parseInt(cpf.substring(nCount - 1, nCount))
    d1 = d1 + (11 - nCount) * digito
    d2 = d2 + (12 - nCount) * digito
  }
  rest = d1 % 11
  dg1 = rest < 2 ? (dg1 = 0) : 11 - rest
  d2 += 2 * dg1
  rest = d2 % 11
  if (rest < 2) dg2 = 0
  else dg2 = 11 - rest
  const nDigVerific = cpf.substring(cpf.length - 2, cpf.length)
  // eslint-disable-next-line prefer-const
  nDigResult = '' + dg1 + '' + dg2
  // eslint-disable-next-line eqeqeq
  return nDigVerific == nDigResult
}

function isValidName(name: string) {
  return name.match(/[a-zA-Z] [a-zA-Z]+/)
}
function isValidEmail(email: string) {
  return email.match(/^(.+)@(.+)$/)
}
function isValidCarPlate(carPlate: string) {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/)
}

export async function signup(input: any): Promise<any> {
  const connection = mysql.createPool(String(process.env.DATABASE_URL))
  try {
    const accountId = crypto.randomUUID()
    const [[account]] = (await connection.query(
      'select * from account where email = ?',
      [input.email],
    )) as any[]
    if (account) throw new Error('Duplicated account')
    if (!isValidName(input.name)) throw new Error('Invalid name')
    if (!isValidEmail(input.email)) throw new Error('Invalid email')
    if (!validateCpf(input.cpf)) throw new Error('Invalid cpf')
    if (input.isDriver && !isValidCarPlate(input.carPlate))
      throw new Error('Invalid car plate')
    await connection.query(
      'insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values (?, ?, ?, ?, ?, ?, ?)',
      [
        accountId,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
      ],
    )
    return {
      accountId,
    }
  } finally {
    connection.pool.end()
  }
}

export async function getAccount(accountId: string) {
  const connection = mysql.createPool(String(process.env.DATABASE_URL))
  const [[account]] = (await connection.query(
    'SELECT * FROM account WHERE account_id = ?',
    [accountId],
  )) as any[]
  connection.pool.end()
  return account
}
