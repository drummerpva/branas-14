import amqp from 'amqplib'

async function main() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  channel.assertQueue('example', { durable: true })
  await channel.consume('example', async (message: any) => {
    console.log(JSON.parse(message.content.toString()))
    channel.ack(message)
  })
}
main()
