import crypto from 'node:crypto'
import { validateCpf } from './CpfValidator'

export class Account {
  public name: string
  public email: string
  public cpf: string
  public carPlate: string
  public isPassenger: boolean
  public isDriver: boolean
  public accountId: string

  private constructor(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
  ) {
    if (!this.isValidName(name)) throw new Error('Invalid name')
    if (!this.isValidEmail(email)) throw new Error('Invalid email')
    if (!validateCpf(cpf)) throw new Error('Invalid cpf')
    if (isDriver && !this.isValidCarPlate(carPlate))
      throw new Error('Invalid car plate')
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
      name,
      email,
      cpf,
      carPlate,
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
      name,
      email,
      cpf,
      carPlate,
      isPassenger,
      isDriver,
    )
  }

  isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/)
  }

  isValidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/)
  }

  isValidCarPlate(carPlate: string) {
    return carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}
