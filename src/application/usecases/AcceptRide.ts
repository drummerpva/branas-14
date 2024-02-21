import { Logger } from '../logger/Logger'
import { AccountRepository } from '../repositories/AccountRepository'
import { RideRepository } from '../repositories/RideRepository'

export class AcceptRide {
  constructor(
    private rideRepository: RideRepository,
    private accountRepository: AccountRepository,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`AcceptRide`)
    const account = await this.accountRepository.getById(input.driverId)
    if (!account?.isDriver) throw new Error('Only drivers can accept ride')
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride does not exist')
    ride.accept(input.driverId)
    await this.rideRepository.update(ride)
  }
}
