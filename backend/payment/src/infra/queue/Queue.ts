import amqp from 'amqplib'

export class Queue {
  async publish(queue: string, data: any) {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
  }

  async consume(queue: string, callback: (input: any) => Promise<void>) {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    console.log(`Consming queue ${queue}`)
    await channel.consume(queue, async (message: any) => {
      const input = JSON.parse(message?.content?.toString())
      await callback(input)
      channel.ack(message)
    })
  }
}
