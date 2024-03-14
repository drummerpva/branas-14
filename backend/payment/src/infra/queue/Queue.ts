import amqp from 'amqplib'

export class Queue {
  async publish(exchange: string, data: any) {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'direct', { durable: true })
    channel.publish(exchange, '', Buffer.from(JSON.stringify(data)))
  }

  async consume(
    exchange: string,
    queue: string,
    callback: (input: any) => Promise<void>,
  ) {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(exchange, 'direct', { durable: true })
    await channel.assertQueue(queue, { durable: true })
    await channel.bindQueue(queue, exchange, '')
    console.log(`Consuming queue ${queue}`)
    await channel.consume(queue, async (message: any) => {
      const input = JSON.parse(message?.content?.toString())
      try {
        await callback(input)
        channel.ack(message)
      } catch (error: any) {
        console.log(`Error on consume ${queue}: ${error}`)
      }
    })
  }
}
