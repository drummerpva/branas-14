import { AccountRepository } from './AccountRepository'
import { Logger } from './Logger'
import { RideRepository } from './RideRepository'

export class StartRide {
  constructor(
    private rideRepository: RideRepository,
    private accountRepository: AccountRepository,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`StartRide`)
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) {
      throw new Error('Ride does not exist')
    }
    ride.start()
    await this.rideRepository.update(ride)
  }
}
