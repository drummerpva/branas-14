import { randomUUID } from 'crypto'

export class Position {
  constructor(
    readonly positionId: string,
    readonly rideId: string,
    readonly lat: number,
    readonly long: number,
    readonly date: Date,
  ) {}

  static create(rideId: string, lat: number, long: number): Position {
    const positionId = randomUUID()
    const date = new Date()
    return new Position(positionId, rideId, lat, long, date)
  }
}
