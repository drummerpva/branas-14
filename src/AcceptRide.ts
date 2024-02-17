import { AccountRepository } from './AccountRepository'
import { Logger } from './Logger'
import { RideRepository } from './RideRepository'

export class AcceptRide {
  constructor(
    private rideRepository: RideRepository,
    private accountRepository: AccountRepository,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`AcceptRide`)
    const account = await this.accountRepository.getById(input.driverId)
    if (!account?.isDriver) {
      throw new Error('Only drivers can accept ride')
    }
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) {
      throw new Error('Ride does not exist')
    }
    ride.status = 'accepted'
    ride.driverId = input.driverId
    await this.rideRepository.update(ride)
  }
}
