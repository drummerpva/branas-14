export interface PaymentGateway {
  processPayment(input: any): Promise<any>
}
