import { DatabaseConnection } from '../database/DatabaseConnection'

export class ORM {
  constructor(private connection: DatabaseConnection) {}

  async save(model: Model) {
    const columns = model.columns.map((column) => column.column).join(',')
    const params = model.columns.map(() => '?').join(',')
    const values = model.columns.map((column) => model[column.property])
    await this.connection.query(
      `INSERT INTO ${model.table}(${columns}) VALUES(${params})`,
      values,
    )
  }

  async get(Entity: any, column: string, value: any): Promise<Model> {
    const [data] = await this.connection.query(
      `SELECT * FROM ${Entity.prototype.table} WHERE ${column} = ?`,
      [value],
    )
    const obj = new Entity()
    for (const column of Entity.prototype.columns) {
      obj[column.property] = data[column.column]
    }
    return obj
  }
}

export class Model {
  declare table: string
  declare columns: { property: string; column: string; pk: boolean }[];
  [key: string]: any
}

export function model(table: string) {
  return function (constructor: Function) {
    constructor.prototype.table = table
  }
}

export function column(name: string, pk: boolean = false) {
  return function (target: any, propertyKey: string) {
    target.columns = target.columns || []
    target.columns.push({ property: propertyKey, column: name, pk })
  }
}
