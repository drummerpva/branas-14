import { DatabaseConnection } from '../../infra/database/DatabaseConnection'

export class GetRideQueryProjection {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(rideId: string): Promise<Output> {
    const [rideData] = await this.connection.query(
      /* sql */ `
      SELECT 
        *
      FROM
        ride_projection
      WHERE ride_id = ?
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
  passengerName: string
  passengerCpf: string
  driverCarPlate?: string
}
