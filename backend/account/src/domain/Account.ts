import crypto from 'node:crypto'
import { Name } from './Name'
import { Email } from './Email'
import { Cpf } from './Cpf'
import { CarPlate } from './CarPlate'

export class Account {
  public name: Name
  public email: Email
  public cpf: Cpf
  public carPlate: CarPlate
  public isPassenger: boolean
  public isDriver: boolean
  public accountId: string

  private constructor(
    accountId: string,
    name: Name,
    email: Email,
    cpf: Cpf,
    carPlate: CarPlate,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    if (isDriver && !carPlate.value) throw new Error('Invalid car plate')
    this.accountId = accountId
    this.name = name
    this.email = email
    this.cpf = cpf
    this.carPlate = carPlate
    this.isPassenger = isPassenger
    this.isDriver = isDriver
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    const accountId = crypto.randomUUID()
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      new CarPlate(carPlate),
      isPassenger,
      isDriver,
    )
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      new CarPlate(carPlate),
      isPassenger,
      isDriver,
    )
  }
}
