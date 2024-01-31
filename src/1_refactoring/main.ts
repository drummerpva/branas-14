import crypto from 'node:crypto'
import mysql from 'mysql2/promise'

export function validateCpf(str: string) {
  if (str !== null) {
    if (str !== undefined) {
      if (str.length >= 11 && str.length <= 14) {
        // cleaning cpf
        str = str
          .replace('.', '')
          .replace('.', '')
          .replace('-', '')
          .replace(' ', '')

        if (!str.split('').every((c) => c === str[0])) {
          try {
            let d1, d2
            let dg1, dg2, rest
            let digito
            let nDigResult
            d1 = d2 = 0
            dg1 = dg2 = rest = 0

            for (let nCount = 1; nCount < str.length - 1; nCount++) {
              // if (isNaN(parseInt(str.substring(nCount -1, nCount)))) {
              // 	return false;
              // } else {

              digito = parseInt(str.substring(nCount - 1, nCount))
              d1 = d1 + (11 - nCount) * digito

              d2 = d2 + (12 - nCount) * digito
              // }
            }

            rest = d1 % 11

            dg1 = rest < 2 ? (dg1 = 0) : 11 - rest
            d2 += 2 * dg1
            rest = d2 % 11
            if (rest < 2) dg2 = 0
            else dg2 = 11 - rest

            const nDigVerific = str.substring(str.length - 2, str.length)
            // eslint-disable-next-line prefer-const
            nDigResult = '' + dg1 + '' + dg2
            // eslint-disable-next-line eqeqeq
            return nDigVerific == nDigResult

            // just in case...
          } catch (e) {
            console.error('Erro !' + e)

            return false
          }
        } else return false
      } else return false
    }
  } else return false
}

export async function signup(input: any): Promise<any> {
  const connection = mysql.createPool(process.env.DATABASE_URL ?? '')
  try {
    const id = crypto.randomUUID()

    const [[acc]] = (await connection.query(
      'select * from account where email = ?',
      [input.email],
    )) as any[]
    if (!acc) {
      if (input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
        if (input.email.match(/^(.+)@(.+)$/)) {
          if (validateCpf(input.cpf)) {
            if (input.isDriver) {
              if (input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
                await connection.query(
                  'insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values (?, ?, ?, ?, ?, ?, ?)',
                  [
                    id,
                    input.name,
                    input.email,
                    input.cpf,
                    input.carPlate,
                    !!input.isPassenger,
                    !!input.isDriver,
                  ],
                )

                const obj = {
                  accountId: id,
                }
                return obj
              } else {
                // invalid car plate
                return -5
              }
            } else {
              await connection.query(
                'insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values (?, ?, ?, ?, ?, ?, ?)',
                [
                  id,
                  input.name,
                  input.email,
                  input.cpf,
                  input.carPlate,
                  !!input.isPassenger,
                  !!input.isDriver,
                ],
              )

              const obj = {
                accountId: id,
              }
              return obj
            }
          } else {
            // invalid cpf
            return -1
          }
        } else {
          // invalid email
          return -2
        }
      } else {
        // invalid name
        return -3
      }
    } else {
      // already exists
      return -4
    }
  } finally {
    connection.pool.end()
  }
}
