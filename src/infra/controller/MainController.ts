import { GetAccount } from '../../application/usecases/GetAccount'
import { HttpServer } from '../http/HttpServer'
import { Signup } from '../../application/usecases/Signup'

export class MainController {
  constructor(httpServer: HttpServer, signup: Signup, getAccount: GetAccount) {
    httpServer.register('post', '/signup', async (params: any, body: any) => {
      const input = body

      const output = await signup.execute(input)
      return output
    })
    httpServer.register('get', '/accounts/:accountId', async (params: any) => {
      const accountId = params.accountId
      const output = await getAccount.execute(accountId)
      return output
    })
  }
}
