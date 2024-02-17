import { Logger } from './Logger'
import { AccountRepository } from './AccountRepository'
import { Ride } from './Ride'
import { RideRepository } from './RideRepository'

export class RequestRide {
  constructor(
    private rideRepository: RideRepository,
    private accountRepository: AccountRepository,
    private logger: Logger,
  ) {}

  async execute(input: any): Promise<any> {
    this.logger.log(`RequestRide`)
    const account = await this.accountRepository.getById(input.passengerId)
    if (!account) {
      throw new Error('Account does not exist')
    }
    if (!account.isPassenger) {
      throw new Error('Only passenger can request a ride')
    }
    const activeRide = await this.rideRepository.getActiveRideByPassengerId(
      input.passengerId,
    )
    if (activeRide) {
      throw new Error('Passenger has an active ride')
    }
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong,
    )
    await this.rideRepository.save(ride)
    return {
      rideId: ride.rideId,
    }
  }
}
