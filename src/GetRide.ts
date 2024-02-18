import { Logger } from './Logger'
import { RideRepository } from './RideRepository'

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
    }
  }
}

type Output = {
  rideId: string
  status: string
  driverId: string
  passengerId: string
  date: Date
}
