import { RideRepository } from './RideRepository'
import { Ride } from './Ride'
import { DatabaseConnection } from './DatabaseConnection'
export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async save(ride: Ride): Promise<void> {
    await this.databaseConnection.query(
      'INSERT INTO ride(ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
      ],
    )
  }

  async update(ride: Ride): Promise<void> {
    await this.databaseConnection.query(
      `UPDATE ride SET status = ?, driver_id = ? WHERE ride_id = ?`,
      [ride.getStatus(), ride.getDriverId(), ride.rideId],
    )
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    const [ride] = await this.databaseConnection.query(
      'SELECT * FROM ride WHERE ride_id = ?',
      [rideId],
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
    )
  }
}
