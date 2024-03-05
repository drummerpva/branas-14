import { Logger } from '../logger/Logger'
import { RideRepository } from '../repositories/RideRepository'
import { TransactionRepository } from '../repositories/TransactionRepository'

export class GetRide {
  constructor(
    private rideRepository: RideRepository,
    private transactionRepository: TransactionRepository,
    private logger: Logger,
  ) {}

  async execute(rideId: string): Promise<Output> {
    this.logger.log(`GetRide`)
    const ride = await this.rideRepository.getById(rideId)
    if (!ride) throw new Error('Ride not found')
    const transaction = await this.transactionRepository.getByRideId(rideId)
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      date: ride.date,
      distance: ride.getDistance(),
      fare: ride.getFare(),
      transactionId: transaction?.transactionId,
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
