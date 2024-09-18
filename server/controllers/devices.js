import shortid from 'shortid'

import devices from '../devices.json'

function wait(ms) {
  var start = Date.now(),
    now = start
  while (now - start < ms) {
    now = Date.now()
  }
  return true
}
export function getDevices(_, res) {
  // Force Show Skeleton :)
  if (wait(300)) res.json(devices)
}

export function addDevice(req, res) {
  const { system_name, type, hdd_capacity } = req.body
  const device = {
    id: shortid.generate(),
    system_name,
    type,
    hdd_capacity,
  }
  devices.push(device)
  console.log(`Creating: ${device}`)
  res.json(device)
}

export function getDevice(req, res) {
  const { id } = req.params
  const device = devices.find((d) => d.id === id)

  if (!device) res.json(0)

  console.log(`Retrieving: ${device}`)
  res.json(device)
}

export function updateDevice(req, res) {
  const { id } = req.params
  const device = devices.find((d) => d.id === id)

  if (!device) res.json(0)

  const { system_name, type, hdd_capacity } = req.body
  console.log(`Updating ${device}`)
  Object.assign(device, { system_name, type, hdd_capacity })
  res.json(1)
}

export function deleteDevice(req, res) {
  const { id } = req.params
  const i = devices.findIndex((d) => d.id === id)

  if (i == -1) res.json(0)
  const device = devices[i]

  console.log(`Removing ${device}`)
  devices.splice(i, 1)
  res.json(1)
}
