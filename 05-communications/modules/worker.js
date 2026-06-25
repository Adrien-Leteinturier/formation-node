import { channel } from './topologie.js'

await channel.prefetch(2)

console.log("✅ Worker en attente de messages...")

channel.consume('rapports', async (msg) => {
    if (msg === null) return

    if(msg)

    try {
        const content = msg.content.toString()
        const rapport = JSON.parse(content)

        if (rapport.titre === 'KO_DEFINITIF'){
            channel.nack(rapport, false, false);
            return;
        }

        if(rapport.titre === 'KO_RETRY'){
            channel.nack(msg, false, true)
            return;
        }

        console.log("Reçu :", rapport)

        await new Promise(r => setTimeout(r, 3000))

        console.log("Traité :", rapport)
        channel.ack(msg)
    } catch (err) {
        channel.nack(msg, false, false)
    }
})