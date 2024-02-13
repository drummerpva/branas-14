import { Logger } from './Logger'
import { RideDAO } from './RideDAO'
import { AccountDAO } from './AccountDAO'

export class StartRide {
  constructor(
    private rideDAO: RideDAO,
    private accountDAO: AccountDAO,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`StartRide`)
    const ride = await this.rideDAO.getById(input.rideId)
    ride.status = 'in_progress'
    await this.rideDAO.update(ride)
  }
}