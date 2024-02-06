import express, { Request, Response } from 'express'
import { getAccount, signup } from './main'
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
