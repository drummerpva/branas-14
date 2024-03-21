import { UseCase } from '../usecases/UseCase'

export class LoggerDecorator implements UseCase {
  constructor(private useCase: UseCase) {}
  async execute(input: any): Promise<any> {
    // logging here
    return this.useCase.execute(input)
  }
}
