import { DatabaseConnection } from '../../infra/database/DatabaseConnection'

export class GetRideQuery {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(rideId: string): Promise<Output> {
    const [rideData] = await this.connection.query(
      `
      SELECT 
        r.ride_id,
        r.fare,
        r.distance,
        r.status,
        r.driver_id,
        r.passenger_id,
        p.name as passenger_name,
        p.cpf as passenger_cpf,
        d.car_plate as driver_car_plate
      FROM
        ride r
        JOIN account p ON r.passenger_id = p.account_id
        LEFT JOIN account d ON r.driver_id = d.account_id
        WHERE
        r.ride_id = ?
    `,
      [rideId],
    )
    return {
      rideId: rideData.ride_id,
      status: rideData.status,
      driverId: rideData.driver_id,
      passengerId: rideData.passenger_id,
      distance: Number(rideData.distance),
      fare: Number(rideData.fare),
      passengerName: rideData.passenger_name,
      passengerCpf: rideData.passenger_cpf,
      driverCarPlate: rideData.driver_car_plate,
    }
  }
}

type Output = {
  rideId: string
  status: string
  driverId: string
  passengerId: string
  distance?: number
  fare?: number
  transactionId?: string
  passengerName: string
  passengerCpf: string
  driverCarPlate?: string
}
