import crypto from 'node:crypto'
import mysql from 'mysql2/promise'
import express, { Request, Response } from 'express'
const app = express()
app.use(express.json())

app.post('/signup', async (req: Request, res: Response) => {
  try {
    const input = req.body
    const output = await signup(input)
    res.json(output)
  } catch (error: any) {
    res.status(422).json({ message: error.message })
  }
})
app.get('/accounts/:accountId', async (req: Request, res: Response) => {
  const accountId = req.params.accountId
  const output = await getAccount(accountId)
  res.json(output)
})

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})

function validateCpf(cpf: string) {
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

async function signup(input: any): Promise<any> {
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

function isValidName(name: string) {
  return name.match(/[a-zA-Z] [a-zA-Z]+/)
}
function isValidEmail(email: string) {
  return email.match(/^(.+)@(.+)$/)
}
function isValidCarPlate(carPlate: string) {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/)
}

async function getAccount(accountId: string) {
  const connection = mysql.createPool(String(process.env.DATABASE_URL))
  const [[account]] = (await connection.query(
    'SELECT * FROM account WHERE account_id = ?',
    [accountId],
  )) as any[]
  connection.pool.end()
  return account
}
