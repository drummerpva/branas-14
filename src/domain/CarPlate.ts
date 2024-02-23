export class CarPlate {
  constructor(readonly value?: string) {
    if (value && !this.isValidCarPlate(value))
      throw new Error('Invalid car plate')
  }

  isValidCarPlate(carPlate: string) {
    return carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}
