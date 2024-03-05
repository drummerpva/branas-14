import { randomUUID } from 'crypto'

export class Transaction {
  private constructor(
    readonly transactionId: string,
    readonly rideId: string,
    readonly amount: number,
    readonly date: Date,
    private status: string,
  ) {}

  static create(rideId: string, amount: number): Transaction {
    const transactionId = randomUUID()
    return new Transaction(
      transactionId,
      rideId,
      amount,
      new Date(),
      'waiting_payment',
    )
  }

  static restore(
    transactionId: string,
    rideId: string,
    amount: number,
    date: Date,
    status: string,
  ): Transaction {
    return new Transaction(transactionId, rideId, amount, date, status)
  }

  pay(): void {
    this.status = 'paid'
  }

  getStatus(): string {
    return this.status
  }
}
