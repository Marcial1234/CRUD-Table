import consign from 'consign'
import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

consign()
  .include('server/libs/middlewares.js')
  .then('server/routes')
  .include('server/libs/boots.js')
  .into(app)

// Deployment integration
app.use('/assets', express.static(join(__dirname, 'dist/assets')))
app.use('/', (_, res) => res.sendFile(join(__dirname, 'dist/index.html')))