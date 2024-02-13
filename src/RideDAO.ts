export interface RideDAO {
  save(ride: any): Promise<void>
  update(ride: any): Promise<void>
  getById(rideId: string): Promise<any>
  listByPassengerId(passengerId: string): Promise<any[]>
  getActiveRideByPassengerId(passengerId: string): Promise<any>
}
