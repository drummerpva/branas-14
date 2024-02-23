import { PositionRepository } from '../../application/repositories/PositionRepository'
import { Coord } from '../../domain/Coor'
import { Position } from '../../domain/Position'
import { DatabaseConnection } from '../database/DatabaseConnection'

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}
  async save(position: Position): Promise<void> {
    await this.connection.query(`INSERT INTO position VALUES(?,?,?,?,?)`, [
      position.positionId,
      position.rideId,
      position.coord.lat,
      position.coord.long,
      position.date,
    ])
  }

  async listByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.connection.query(
      `SELECT p.* FROM position p WHERE p.ride_id = ? ORDER BY p.date ASC`,
      [rideId],
    )
    const positions: Position[] = []
    for (const positionData of positionsData) {
      positions.push(
        new Position(
          positionData.position_id,
          positionData.ride_id,
          new Coord(Number(positionData.lat), Number(positionData.long)),
          positionData.date,
        ),
      )
    }
    return positions
  }
}
