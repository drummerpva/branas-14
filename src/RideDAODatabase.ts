import { RideDAO } from './RideDAO'
import mysql from 'mysql2/promise'
export class RideDAODatabase implements RideDAO {
  async save(ride: any): Promise<void> {
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    await connection.query(
      'INSERT INTO ride(ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.status,
        ride.date,
      ],
    )
    connection.pool.end()
  }

  async getById(rideId: string): Promise<any> {
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    const [[ride]] = (await connection.query(
      'SELECT * FROM ride WHERE ride_id = ?',
      [rideId],
    )) as any[]
    connection.pool.end()
    return ride
  }

  async listByPassengerId(passengerId: string): Promise<any[]> {
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    const [rides] = (await connection.query(
      'SELECT * FROM ride WHERE passenger_id = ?',
      [passengerId],
    )) as any[]
    connection.pool.end()
    return rides
  }

  async getActiveRideByPassengerId(passengerId: string): Promise<any> {
    const connection = mysql.createPool(String(process.env.DATABASE_URL))
    const [[ride]] = (await connection.query(
      `SELECT * FROM ride WHERE passenger_id = ? AND status IN (?) LIMIT 1`,
      [passengerId, ['requested', 'accepted', 'in_progress']],
    )) as any[]
    connection.pool.end()
    return ride
  }
}
