import { HttpServer } from '../http/HttpServer'
import { inject } from '../di/Registry'

export class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  constructor() {
    // this.httpServer?.register(
    //   'post',
    //   '/signup',
    //   async (params: any, body: any) => {
    //     const input = body
    //     const output = await this.signup?.execute(input)
    //     return output
    //   },
    // )
    // this.httpServer?.register(
    //   'get',
    //   '/accounts/:accountId',
    //   async (params: any) => {
    //     const accountId = params.accountId
    //     const output = await this.getAccount?.execute(accountId)
    //     return output
    //   },
    // )
  }
}
