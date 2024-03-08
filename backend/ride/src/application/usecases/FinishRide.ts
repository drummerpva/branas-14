import { PaymentGateway } from '../gateway/PaymentGateway'
import { Logger } from '../logger/Logger'
import { RideRepository } from '../repositories/RideRepository'

export class FinishRide {
  constructor(
    private rideRepository: RideRepository,
    private paymentGateway: PaymentGateway,
    private logger: Logger,
  ) {}

  async execute(input: Input): Promise<void> {
    await this.logger.log('FinishRide')
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() !== 'in_progress')
      throw new Error('Ride is not in progress')
    ride.finish()
    await this.rideRepository.update(ride)
    await this.paymentGateway.processPayment({
      rideId: ride.rideId,
      amount: ride.getFare(),
    })
  }
}

type Input = {
  rideId: string
}
