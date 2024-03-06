import { GetAccount } from '../../application/usecases/GetAccount'
import { HttpServer } from '../http/HttpServer'
import { Signup } from '../../application/usecases/Signup'
import { inject } from '../di/Registry'

export class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('signup')
  signup?: Signup

  @inject('getAccount')
  getAccount?: GetAccount

  constructor() {
    this.httpServer?.register(
      'post',
      '/signup',
      async (params: any, body: any) => {
        const input = body

        const output = await this.signup?.execute(input)
        return output
      },
    )
    this.httpServer?.register(
      'get',
      '/accounts/:accountId',
      async (params: any) => {
        try {
          const accountId = params.accountId
          const output = await this.getAccount?.execute(accountId)
          return output
        } catch (error: any) {
          return undefined
        }
      },
    )
  }
}
