import axios from 'axios'
import { PaymentGateway } from '../../application/gateway/PaymentGateway'

export class PaymentGatewayHttp implements PaymentGateway {
  async processPayment(input: any): Promise<any> {
    await axios.post('http://localhost:3002/process_payment', input)
  }
}
