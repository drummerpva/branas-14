import crypto from 'node:crypto'
import { Logger } from './Logger'
import { RideDAO } from './RideDAO'

export class RequestRide {
  constructor(
    private rideDAO: RideDAO,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`RequestRide`)
    input.rideId = crypto.randomUUID()
    input.status = 'requested'
    input.date = new Date()
    await this.rideDAO.save(input)
    return {
      rideId: input.rideId,
    }
  }

  isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/)
  }

  isValidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/)
  }

  isValidCarPlate(carPlate: string) {
    return carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}
