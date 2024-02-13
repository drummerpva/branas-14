import crypto from 'node:crypto'
import { Logger } from './Logger'
import { RideDAO } from './RideDAO'
import { AccountDAO } from './AccountDAO'

export class RequestRide {
  constructor(
    private rideDAO: RideDAO,
    private accountDAO: AccountDAO,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`RequestRide`)
    const account = await this.accountDAO.getById(input.passengerId)
    if (!account) {
      throw new Error('Account does not exist')
    }
    if (!account.is_passenger) {
      throw new Error('Only passenger can request a ride')
    }
    const activeRide = await this.rideDAO.getActiveRideByPassengerId(
      input.passengerId,
    )
    if (activeRide) {
      throw new Error('Passenger has an active ride')
    }
    input.rideId = crypto.randomUUID()
    input.status = 'requested'
    input.date = new Date()
    await this.rideDAO.save(input)
    return {
      rideId: input.rideId,
    }
  }
}
