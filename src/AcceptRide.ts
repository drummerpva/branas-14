import { Logger } from './Logger'
import { RideDAO } from './RideDAO'
import { AccountDAO } from './AccountDAO'

export class AcceptRide {
  constructor(
    private rideDAO: RideDAO,
    private accountDAO: AccountDAO,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`AcceptRide`)
    const account = await this.accountDAO.getById(input.driverId)
    if (!account.is_driver) {
      throw new Error('Only drivers can accept ride')
    }
    const ride = await this.rideDAO.getById(input.rideId)
    ride.status = 'accepted'
    ride.driverId = input.driverId
    await this.rideDAO.update(ride)
  }
}
