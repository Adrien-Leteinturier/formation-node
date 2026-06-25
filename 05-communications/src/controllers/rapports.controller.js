import { channel } from '../../modules/topologie.js'

export async function sendRapports(req, res) {
  try {
    const rapport = req.body

    if (!rapport) {
      return res.status(400).json({
        error: "body requis"
      })
    }

    channel.publish(
        'logs',
        'logs.error',
        Buffer.from(JSON.stringify(rapport)),
        { persistent: true }
    )

    res.status(200).json({
      statut: "accepte",
      id: Date.now()
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Erreur RabbitMQ"
    })
  }
}
