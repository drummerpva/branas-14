import { AccountRepository } from './AccountRepository'
import { Logger } from './Logger'
import { RideDAO } from './RideDAO'

export class AcceptRide {
  constructor(
    private rideDAO: RideDAO,
    private accountRepository: AccountRepository,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`AcceptRide`)
    const account = await this.accountRepository.getById(input.driverId)
    if (!account?.isDriver) {
      throw new Error('Only drivers can accept ride')
    }
    const ride = await this.rideDAO.getById(input.rideId)
    ride.status = 'accepted'
    ride.driverId = input.driverId
    await this.rideDAO.update(ride)
  }
}
