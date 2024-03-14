import { RideCompletedEvent } from '../../domain/event/RideCompletedEvent'
import { DatabaseConnection } from '../../infra/database/DatabaseConnection'

export class UpdateRideProjection {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(input: RideCompletedEvent): Promise<void> {
    const [rideData] = await this.connection.query(
      /* sql */ `
      SELECT 
        r.ride_id,
        r.fare,
        r.distance,
        r.status,
        r.driver_id,
        r.passenger_id,
        p.name as passenger_name,
        p.cpf as passenger_cpf,
        d.name as driver_name,
        d.cpf as driver_cpf,
        d.car_plate as driver_car_plate
      FROM
        ride r
        JOIN account p ON r.passenger_id = p.account_id
        LEFT JOIN account d ON r.driver_id = d.account_id
        WHERE
        r.ride_id = ?
    `,
      [input.rideId],
    )
    await this.connection.query(
      /* sql */ `
      INSERT INTO ride_projection
        (ride_id, passenger_id, driver_id, fare, distance, status, 
        passenger_name, passenger_cpf, driver_name, driver_cpf, driver_car_plate)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        rideData.ride_id,
        rideData.passenger_id,
        rideData.driver_id,
        Number(rideData.fare),
        Number(rideData.distance),
        rideData.status,
        rideData.passenger_name,
        rideData.passenger_cpf,
        rideData.driver_name,
        rideData.driver_cpf,
        rideData.driver_car_plate,
      ],
    )
  }
}
