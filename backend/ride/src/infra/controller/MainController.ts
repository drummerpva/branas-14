import { HttpServer } from '../http/HttpServer'
import { inject } from '../di/Registry'
import { RequestRide } from '../../application/usecases/RequestRide'
import { Queue } from '../queue/Queue'

export class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('requestRide')
  requestRide?: RequestRide

  @inject('queue')
  queue?: Queue

  constructor() {
    this.httpServer?.register(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        const input = body
        const output = await this.requestRide?.execute(input)
        return output
      },
    )
    this.httpServer?.register(
      'post',
      '/request_ride_async',
      async (params: any, body: any) => {
        this.queue?.publish('requestRide', body)
      },
    )
  }
}
