import { Logger } from './Logger'
import { RideDAO } from './RideDAO'

export class GetRide {
  constructor(
    private rideDAO: RideDAO,
    private logger: Logger,
  ) {}

  async execute(rideId: string): Promise<any> {
    this.logger.log(`GetRide`)
    const ride = await this.rideDAO.getById(rideId)
    return ride
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
