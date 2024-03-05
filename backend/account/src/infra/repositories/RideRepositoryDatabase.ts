import { RideRepository } from '../../application/repositories/RideRepository'
import { Coord } from '../../domain/Coord'
import { Ride } from '../../domain/Ride'
import { DatabaseConnection } from '../database/DatabaseConnection'
export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async save(ride: Ride): Promise<void> {
    await this.databaseConnection.query(
      'INSERT INTO ride(ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, distance, fare) VALUES (?, ?, ?, ?, ?, ?, ?, ? ,? ,?)',
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
        ride.getDistance(),
        ride.getFare(),
      ],
    )
  }

  async update(ride: Ride): Promise<void> {
    await this.databaseConnection.query(
      `UPDATE ride SET status = ?, driver_id = ?, distance = ?, fare = ?, last_lat = ?, last_long = ? WHERE ride_id = ?`,
      [
        ride.getStatus(),
        ride.getDriverId(),
        ride.getDistance(),
        ride.getFare(),
        ride.getLastPosition()?.lat,
        ride.getLastPosition()?.long,
        ride.rideId,
      ],
    )
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    const [ride] = await this.databaseConnection.query(
      'SELECT * FROM ride WHERE ride_id = ?',
      [rideId],
    )
    if (!ride) return
    const lastPosition =
      !!ride.last_lat && !!ride.last_long
        ? new Coord(Number(ride.last_lat), Number(ride.last_long))
        : undefined
    return new Ride(
      ride.ride_id,
      ride.passenger_id,
      ride.driver_id,
      ride.status,
      ride.date,
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      Number(ride.distance),
      Number(ride.fare),
      lastPosition,
    )
  }

  async listByPassengerId(passengerId: string): Promise<Ride[]> {
    const rides = await this.databaseConnection.query(
      'SELECT * FROM ride WHERE passenger_id = ?',
      [passengerId],
    )
    return rides.map(
      (rideData: any) =>
        new Ride(
          rideData.ride_id,
          rideData.passenger_id,
          rideData.driver_id,
          rideData.status,
          rideData.date,
          Number(rideData.from_lat),
          Number(rideData.from_long),
          Number(rideData.to_lat),
          Number(rideData.to_long),
          Number(rideData.distance),
          Number(rideData.fare),
          !!rideData.last_lat && !!rideData.last_long
            ? new Coord(Number(rideData.last_lat), Number(rideData.last_long))
            : undefined,
        ),
    )
  }

  async getActiveRideByPassengerId(
    passengerId: string,
  ): Promise<Ride | undefined> {
    const [ride] = await this.databaseConnection.query(
      `SELECT * FROM ride WHERE passenger_id = ? AND status IN (?) LIMIT 1`,
      [passengerId, ['requested', 'accepted', 'in_progress']],
    )
    if (!ride) return
    return new Ride(
      ride.ride_id,
      ride.passenger_id,
      ride.driver_id,
      ride.status,
      ride.date,
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      Number(ride.distance),
      Number(ride.fare),
      !!ride.last_lat && !!ride.last_long
        ? new Coord(Number(ride.last_lat), Number(ride.last_long))
        : undefined,
    )
  }
}
