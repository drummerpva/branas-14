import { Coord } from '../../domain/Coord'
import { DistanceCalculator } from '../../domain/DistanceCalculator'
import { Logger } from '../logger/Logger'
import { PositionRepository } from '../repositories/PositionRepository'
import { RideRepository } from '../repositories/RideRepository'

export class GetRide {
  constructor(
    private rideRepository: RideRepository,
    private positionRepository: PositionRepository,
    private logger: Logger,
  ) {}

  async execute(rideId: string): Promise<Output> {
    this.logger.log(`GetRide`)
    const ride = await this.rideRepository.getById(rideId)
    if (!ride) throw new Error('Ride not found')
    const positions = await this.positionRepository.listByRideId(rideId)
    let distance = 0
    for (const [index, position] of positions.entries()) {
      if (!positions[index + 1]) break
      const from = new Coord(position.coord.lat, position.coord.long)
      const to = new Coord(
        positions[index + 1].coord.lat,
        positions[index + 1].coord.long,
      )
      distance += DistanceCalculator.calculate(from, to)
    }
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      date: ride.date,
      distance,
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
}
