import express from 'express'
import { sendRapports } from "./controllers/rapports.controller.js";

const app = express()

const port = process.env.PORT || 3000;

app.use(express.json())

app.post('/rapports', sendRapports)

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
})