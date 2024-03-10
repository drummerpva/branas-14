import { Logger } from '../logger/Logger'
import { RideRepository } from '../repositories/RideRepository'

export class GetRideByPassengerId {
  constructor(
    private rideRepository: RideRepository,
    private logger: Logger,
  ) {}

  async execute(passengerId: string): Promise<Output> {
    this.logger.log(`GetRideByPassengerId`)
    const ride =
      await this.rideRepository.getActiveRideByPassengerId(passengerId)
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
