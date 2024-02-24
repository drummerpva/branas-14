import { randomUUID } from 'crypto'
import { RideStatus, RideStatusFactory } from './RideStatus'
import { Position } from './Position'
import { Coord } from './Coord'
import { DistanceCalculator } from './DistanceCalculator'

export class Ride {
  public status: RideStatus
  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private driverId: string,
    status: string,
    readonly date: Date,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    private distance: number = 0,
    private fare: number = 0,
    private lastPosition?: Coord,
  ) {
    this.status = RideStatusFactory.create(status, this)
  }

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

  accept(driverId: string) {
    this.driverId = driverId
    this.status.accept()
  }

  start() {
    this.status.start()
  }

  finish() {
    this.fare = this.distance * 2.1
    this.status.finish()
  }

  updatePosition(position: Position) {
    if (this.lastPosition) {
      this.distance += DistanceCalculator.calculate(
        this.lastPosition,
        position.coord,
      )
    }
    this.lastPosition = position.coord
  }

  getStatus() {
    return this.status.value
  }

  getDriverId() {
    return this.driverId
  }

  getFare() {
    return this.fare
  }

  getDistance() {
    return this.distance
  }

  getLastPosition() {
    return this.lastPosition
  }
}
