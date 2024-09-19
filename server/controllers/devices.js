import shortid from 'shortid'

import server_devices from '../devices.json'

/* Server State  */
var devices = [...server_devices]
var first = true

function wait(ms) {
  var start = Date.now(),
    now = start
  while (now - start < ms) {
    now = Date.now()
  }
  return true
}

export function getDevices(_, res) {
  // Force wait sync the first time the server runs to show Skeleton  :)
  if (first && wait(750)) {
    first = false
    res.json(devices)
  } else res.json(devices)
}

export function getDevice(req, res) {
  const { id } = req.params
  const device = devices.find((d) => d.id === id)

  if (device) {
    res.status(400).json({ error: 'ID not found' })
  } else {
    console.log(`Retrieving: ${JSON.stringify(device)}`)
    res.json(device)
  }
}

export function addDevice(req, res) {
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

export function updateDevice(req, res) {
  const { id } = req.params
  const i = devices.findIndex((d) => d.id === id)

  if (i !== -1) {
    const { system_name, type, hdd_capacity } = req.body
    console.log(`Updating with ${JSON.stringify(req.body)}`)
    devices[i] = Object.assign(devices[i], {
      type,
      system_name,
      hdd_capacity: Number(hdd_capacity),
    })
    res.send(devices[i])
  } else {
    res.status(404).json({ error: 'ID not found' })
  }
}

export function deleteDevice(req, res) {
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

export function resetDevices(_, res) {
  // Always wait sync to show Skeleton :)
  if (wait(200)) {
    devices = [...server_devices]
    res.status(201).json(devices)
  }
}
