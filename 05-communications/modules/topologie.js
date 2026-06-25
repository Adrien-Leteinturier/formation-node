import amqp from 'amqplib'

const connection = await amqp.connect('amqp://localhost:5672')
const channel = await connection.createChannel()

await channel.assertExchange('logs', 'direct', { durable: true })
await channel.assertExchange('dlx', 'direct', { durable: true })
await channel.assertQueue('rapports', {
    durable: true,
    arguments: {
        'x-dead-letter-exchange': 'dlx',
        'x-dead-letter-routing-key': 'rapports.dlq'
    }
})

await channel.assertQueue('rapports.dlq', { durable: true })
await channel.bindQueue('rapports', 'logs', 'logs.error')
await channel.bindQueue('rapports.dlq', 'dlx', 'rapports.dlq')

export { channel }
