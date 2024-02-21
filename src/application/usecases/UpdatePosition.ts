import { Position } from '../../domain/Position'
import { Logger } from '../logger/Logger'
import { PositionRepository } from '../repositories/PositionRepository'
import { RideRepository } from '../repositories/RideRepository'

export class UpdatePosition {
  constructor(
    private rideRepository: RideRepository,
    private positionRepository: PositionRepository,
    private logger: Logger,
  ) {}

  async execute(input: Input): Promise<void> {
    await this.logger.log('UpdatePosition')
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() !== 'in_progress')
      throw new Error('Ride is not in progress')
    const position = Position.create(input.rideId, input.lat, input.long)
    await this.positionRepository.save(position)
  }
}

type Input = {
  rideId: string
  lat: number
  long: number
}
