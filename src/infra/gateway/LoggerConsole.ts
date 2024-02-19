import { Logger } from '../../application/gateway/Logger'

export class LoggerConsole implements Logger {
  async log(message: string) {
    // console.log(message)
  }
}
