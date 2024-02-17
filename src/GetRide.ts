import { Logger } from './Logger'
import { RideRepository } from './RideRepository'

export class GetRide {
  constructor(
    private rideRepository: RideRepository,
    private logger: Logger,
  ) {}

  async execute(rideId: string): Promise<any> {
    this.logger.log(`GetRide`)
    const ride = await this.rideRepository.getById(rideId)
    return ride
  }
}
