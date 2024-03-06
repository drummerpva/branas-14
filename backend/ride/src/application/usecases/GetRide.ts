import { Logger } from '../logger/Logger'
import { RideRepository } from '../repositories/RideRepository'

export class GetRide {
  constructor(
    private rideRepository: RideRepository,
    private logger: Logger,
  ) {}

  async execute(rideId: string): Promise<Output> {
    this.logger.log(`GetRide`)
    const ride = await this.rideRepository.getById(rideId)
    if (!ride) throw new Error('Ride not found')
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      date: ride.date,
      distance: ride.getDistance(),
      fare: ride.getFare(),
    }
  }
}

type Output = {
  rideId: string
  status: string
  driverId: string
  passengerId: string
  date: Date
  distance?: number
  fare?: number
  transactionId?: string
}
