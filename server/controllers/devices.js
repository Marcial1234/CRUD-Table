
import shortid from "shortid"
import devices from "../devices.json"

export function getDevices(_, res) {
  res.json(devices)
}

export function addDevice(req, res) {
  const { system_name, type, hdd_capacity } = req.body
  const newDevice = {
    id: shortid.generate(),
    system_name,
    type,
    hdd_capacity
  }
  devices.push(newDevice)
  res.json(newDevice)
}

export function getDevice(req, res) {
  const { id } = req.params
  const device = devices.find(d => d.id === id)
  res.json(device)
}

export function updateDevice(req, res) {
  const { id } = req.params
  const foundDevice = devices.find(d => d.id === id)
  if (foundDevice == -1) res.json(0)

  const { system_name, type, hdd_capacity } = req.body
  Object.assign(foundDevice, { system_name, type, hdd_capacity })
  res.json(1)
}

export function deleteDevice(req, res) {
  const { id } = req.params
  const i = devices.findIndex((d => d.id === id))
  if (i == -1) res.json(0)

  devices.splice(i, 1)
  res.json(1)
}