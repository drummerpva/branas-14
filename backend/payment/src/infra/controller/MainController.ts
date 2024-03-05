import { HttpServer } from '../http/HttpServer'
import { inject } from '../di/Registry'
import { ProcessPayment } from '../../application/usecases/ProcessPayment'
import { GetTransactionByRideId } from '../../application/usecases/GetTransactionByRideId'

export class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('processPayment')
  processPayment?: ProcessPayment

  @inject('getTransactionByRideId')
  getTransactionByRideId?: GetTransactionByRideId

  constructor() {
    this.httpServer?.register(
      'post',
      '/process_payment',
      async (params: any, body: any) => {
        const input = body
        const output = await this.processPayment?.execute(input)
        return output
      },
    )
    this.httpServer?.register(
      'get',
      '/rides/:rideId/transactions',
      async (params: any) => {
        const input = params.rideId
        const output = await this.getTransactionByRideId?.execute(input)
        return output
      },
    )
  }
}
