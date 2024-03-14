import { AccountGateway } from '../gateway/AccountGateway'
import { RideRepository } from '../repositories/RideRepository'

export class GetRideAPIComposition {
  constructor(
    private rideRepository: RideRepository,
    private accountGateway: AccountGateway,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getById(rideId)
    if (!ride) throw new Error('Ride not found')
    const passenger = await this.accountGateway.getById(ride.passengerId)
    let driver
    if (ride.getDriverId()) {
      driver = await this.accountGateway.getById(ride.getDriverId())
    }
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      date: ride.date,
      distance: ride.getDistance(),
      fare: ride.getFare(),
      passengerName: passenger.name,
      passengerCpf: passenger.cpf,
      driverCarPlate: driver?.carPlate,
    }
  }
}

type Output = {
  rideId: string
  status: string
  driverId: string
  passengerId: string
  date: Date
  distance?: number
  fare?: number
  passengerName: string
  passengerCpf: string
  driverCarPlate?: string
}
