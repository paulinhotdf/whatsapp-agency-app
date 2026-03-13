require("dotenv").config()

const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.json())

// teste servidor
app.get("/", (req, res) => {
  res.send("WhatsApp AI Agent running 🚀")
})

// verificação webhook Meta
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge)
  }

  return res.sendStatus(403)
})

// receber mensagem
app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body

    const from =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from

    if (!message) {
      return res.sendStatus(200)
    }

    console.log("Mensagem recebida:", message)

    // chamar OpenAI
    const ai = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em marketing digital."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const reply = ai.data.choices[0].message.content

    console.log("Resposta IA:", reply)

    // enviar resposta para WhatsApp
    await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    )

    res.sendStatus(200)
  } catch (error) {
    console.error("Erro:", error.response?.data || error.message)
    res.sendStatus(500)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
