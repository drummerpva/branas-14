import { Logger } from './Logger'

export class LoggerConsole implements Logger {
  async log(message: string) {
    // console.log(message)
  }
}
