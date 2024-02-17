import { randomUUID } from 'crypto'

export class Ride {
  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    public driverId: string,
    public status: string,
    readonly date: Date,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
  ) {}

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = randomUUID()
    const driverId = ''
    const status = 'requested'
    const date = new Date()
    return new Ride(
      rideId,
      passengerId,
      driverId,
      status,
      date,
      fromLat,
      fromLong,
      toLat,
      toLong,
    )
  }
}
