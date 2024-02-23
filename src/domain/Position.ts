import { randomUUID } from 'crypto'
import { Coord } from './Coor'

export class Position {
  constructor(
    readonly positionId: string,
    readonly rideId: string,
    readonly coord: Coord,
    readonly date: Date,
  ) {}

  static create(rideId: string, lat: number, long: number): Position {
    const positionId = randomUUID()
    const date = new Date()
    return new Position(positionId, rideId, new Coord(lat, long), date)
  }
}
