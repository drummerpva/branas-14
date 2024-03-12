import { Queue } from '../../infra/queue/Queue'
import { PaymentGateway } from '../gateway/PaymentGateway'
import { Logger } from '../logger/Logger'
import { RideRepository } from '../repositories/RideRepository'

export class FinishRide {
  constructor(
    private rideRepository: RideRepository,
    private paymentGateway: PaymentGateway,
    private logger: Logger,
    private queue: Queue,
  ) {}

  async execute(input: Input): Promise<void> {
    await this.logger.log('FinishRide')
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride not found')
    // ride.register(async (event: DomainEvent) => {
    //   await this.queue.publish(event.name, event)
    //   Não funciona, precisa transaformar o método notify em async bem como o notify em Aggregate
    // })
    if (ride.getStatus() !== 'in_progress')
      throw new Error('Ride is not in progress')
    ride.finish()
    await this.rideRepository.update(ride)
    for (const event of ride.getEvents()) {
      await this.queue.publish(event.name, event)
    }
  }
}

type Input = {
  rideId: string
}
