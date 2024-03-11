import { DomainEvent } from './DomainEvent'

export class RideCompletedEvent implements DomainEvent {
  name = 'rideCompleted'
  constructor(
    public readonly rideId: string,
    public readonly fare: number,
  ) {}
}
