import { Ride } from './Ride'

export interface RideRepository {
  save(ride: Ride): Promise<void>
  update(ride: Ride): Promise<void>
  getById(rideId: string): Promise<Ride | undefined>
  listByPassengerId(passengerId: string): Promise<Ride[]>
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>
}
