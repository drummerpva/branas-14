import express, { Request, Response } from 'express'
import { Signup } from './Signup'
import { GetAccount } from './GetAccount'
import { LoggerConsole } from './LoggerConsole'
import { AccountRepositoryDatabase } from './AccountRepositoryDatabase'
const app = express()
app.use(express.json())

app.post('/signup', async (req: Request, res: Response) => {
  try {
    const input = req.body
    const accountRepository = new AccountRepositoryDatabase()
    const logger = new LoggerConsole()
    const signup = new Signup(accountRepository, logger)
    const output = await signup.execute(input)
    res.json(output)
  } catch (error: any) {
    res.status(422).json({ message: error.message })
  }
})
app.get('/accounts/:accountId', async (req: Request, res: Response) => {
  const accountId = req.params.accountId
  const accountRepository = new AccountRepositoryDatabase()
  const getAccount = new GetAccount(accountRepository)
  const output = await getAccount.execute(accountId)
  res.json(output)
})

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})
