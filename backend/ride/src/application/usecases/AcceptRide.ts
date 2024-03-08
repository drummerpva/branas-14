import { AccountGateway } from '../gateway/AccountGateway'
import { Logger } from '../logger/Logger'
import { RideRepository } from '../repositories/RideRepository'

export class AcceptRide {
  constructor(
    private rideRepository: RideRepository,
    private accountGateway: AccountGateway,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`AcceptRide`)
    const account = await this.accountGateway.getById(input.driverId)
    if (!account?.isDriver) throw new Error('Only drivers can accept ride')
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride does not exist')
    ride.accept(input.driverId)
    await this.rideRepository.update(ride)
  }
}
