import bodyParser from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import { dirname, join } from 'path'
import shortid from 'shortid'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SERVER_DEVICES = Object.freeze([
  {
    id: 'e8okoP2l5',
    system_name: 'DESKTOP-SMART',
    type: 'WINDOWS',
    hdd_capacity: '10',
  },
  {
    id: 'Th3ngERn9',
    system_name: 'MAC-LEADER',
    type: 'MAC',
    hdd_capacity: '2048',
  },
  {
    id: 'Q1JdBnE12',
    system_name: 'ARMANDO',
    type: 'WINDOWS',
    hdd_capacity: '256',
  },
  {
    id: 'e7ocoQ2n3',
    system_name: 'MIGUEL-PC',
    type: 'WINDOWS',
    hdd_capacity: '500',
  },
  {
    id: 'Jj5bn3G2H',
    system_name: 'FIRST-MAC',
    type: 'MAC',
    hdd_capacity: '180',
  },
  {
    id: 'GT556QGnk',
    system_name: 'GOOD-MAC',
    type: 'MAC',
    hdd_capacity: '500',
  },
  {
    id: 'ppRmcE9p8',
    system_name: 'JACK-GUEST',
    type: 'LINUX',
    hdd_capacity: '302',
  },
  {
    id: 'R5LdSnQhY',
    system_name: 'HOME-ONE',
    type: 'WINDOWS',
    hdd_capacity: '50',
  },
  {
    id: 'ab1coL2n9',
    system_name: 'GILBERT-COMPUTER',
    type: 'WINDOWS',
    hdd_capacity: '750',
  },
  {
    id: 'LM5dBnJ2G',
    system_name: 'MOON-SMART',
    type: 'WINDOWS',
    hdd_capacity: '256',
  },
  {
    id: 'Up5bcEQp4',
    system_name: 'JULIO-MAC-LOCAL',
    type: 'MAC',
    hdd_capacity: '512',
  },
  {
    id: 'Up5ncErp8',
    system_name: 'RYANN-HOST',
    type: 'LINUX',
    hdd_capacity: '220',
  },
])

/* Server State  */
var devices = [...SERVER_DEVICES]
var first = true

function wait(ms) {
  var start = Date.now(),
    now = start
  while (now - start < ms) {
    now = Date.now()
  }
  return true
}

function getDevices(_, res) {
  // Force wait sync the first time the server runs to show Skeleton  :)
  if (first && wait(750)) {
    first = false
    res.json(devices)
  } else res.json(devices)
}

function getDevice(req, res) {
  const { id } = req.params
  const device = devices.find((d) => d.id === id)

  if (device) {
    res.status(400).json({ error: 'ID not found' })
  } else {
    console.log(`Retrieving: ${JSON.stringify(device)}`)
    res.json(device)
  }
}

function addDevice(req, res) {
  const { system_name, type, hdd_capacity } = req.body
  const device = {
    id: shortid.generate(),
    system_name,
    type,
    hdd_capacity,
  }
  devices = [device, ...devices]
  console.log(`Creating: ${JSON.stringify(device)}`)
  res.status(201).json(device)
}

function updateDevice(req, res) {
  const { id } = req.params
  const i = devices.findIndex((d) => d.id === id)

  if (i !== -1) {
    const { system_name, type, hdd_capacity } = req.body
    console.log(`Updating with ${JSON.stringify(req.body)}`)
    devices[i] = {
      type,
      system_name,
      id: devices[i].id,
      hdd_capacity: Number(hdd_capacity),
    }
    res.send(devices[i])
  } else {
    res.status(404).json({ error: 'ID not found' })
  }
}

function deleteDevice(req, res) {
  const { id } = req.params
  const i = devices.findIndex((d) => d.id === id)

  if (i !== -1) {
    const device = devices[i]
    console.log(`Removing ${JSON.stringify(device)}`)
    devices.splice(i, 1)
    res.status(204).send()
  } else {
    res.status(404).json({ error: 'ID not found' })
  }
}

function resetDevices(_, res) {
  // Always wait sync to show Skeleton :)
  if (wait(200)) {
    devices = [...SERVER_DEVICES]
    res.status(201).json(devices)
  }
}

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))

app.listen(app.get('port'), () =>
  console.log(`Open browser to http://localhost:${app.get('port')}`),
)

app.use(express.static(join(__dirname, 'dist')))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

const router = express.Router()
router
  .route('/devices')
  .get(getDevices)
  .post(addDevice)
  .delete(resetDevices) /* Non-standard REST usage */

router
  .route('/devices/:id')
  .get(getDevice) /* not used */
  .put(updateDevice)
  .delete(deleteDevice)

app.use('/api', router)

app.use('/', (_, res) => res.sendFile(join(__dirname, 'dist/index.html')))
