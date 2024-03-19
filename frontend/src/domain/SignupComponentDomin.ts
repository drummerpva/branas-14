export class SignupComponentDomain {
  name = ''
  email = ''
  cpf = ''
  step = 1
  carPlate = ''
  isPassenger = false
  isDriver = false
  error = ''
  constructor() {}

  nextStep() {
    if (this.step === 1 && !this.isPassenger && !this.isDriver) {
      this.error = 'Select at least one option'
    }
    if (this.step === 2) {
      if (!this.name) {
        this.error = 'Invalid name'
      }
      if (!this.email) {
        this.error = 'Invalid email'
      }
      if (!this.cpf) {
        this.error = 'Invalid CPF'
      }
      if (this.isDriver && !this.carPlate) {
        this.error = 'Invalid car plate'
      }
    }
    this.error = ''
    this.step++
  }

  previousStep() {
    this.step--
  }

  isNextButtonVisible() {
    return this.step < 3
  }

  isPreviousButtonVisible() {
    return this.step > 1 && this.step < 4
  }

  isSubmitButtonVisible() {
    return this.step === 3
  }
}
