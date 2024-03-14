import { RideCompletedEvent } from '../../domain/event/RideCompletedEvent'
import { DatabaseConnection } from '../../infra/database/DatabaseConnection'
import { AccountGateway } from '../gateway/AccountGateway'

export class UpdateRideProjectionAPIComposition {
  constructor(
    readonly connection: DatabaseConnection,
    readonly accountGateway: AccountGateway,
  ) {}

  async execute(input: RideCompletedEvent): Promise<void> {
    const [rideData] = await this.connection.query(
      /* sql */ `
      SELECT 
        r.ride_id,
        r.fare,
        r.distance,
        r.status,
        r.driver_id,
        r.passenger_id
      FROM
        ride r 
      WHERE r.ride_id = ?
    `,
      [input.rideId],
    )
    const passenger = await this.accountGateway.getById(rideData.passenger_id)
    let driver
    if (rideData.driver_id) {
      driver = await this.accountGateway.getById(rideData.driver_id)
    }
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
        passenger.name,
        passenger.cpf,
        driver?.name,
        driver?.cpf,
        driver?.carPlate,
      ],
    )
  }
}
