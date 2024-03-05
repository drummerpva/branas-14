import axios from 'axios'
import { randomUUID } from 'crypto'
axios.defaults.validateStatus = () => true

test('Deve processar um pagamento pela API', async () => {
  const rideId = randomUUID()
  const inputProcessPayment = {
    rideId,
    creditCardToken: '123456789',
    amount: 100,
  }
  await axios.post(`http://localhost:3002/process_payment`, inputProcessPayment)
  const response = await axios.get(
    `http://localhost:3002/rides/${rideId}/transactions`,
  )
  const output = response.data
  expect(output.rideId).toBe(rideId)
  expect(output.status).toBe('paid')
})
