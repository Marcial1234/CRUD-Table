import { api } from '@/lib/utils'

export function getAllDevices() {
  return api
    .get(`/devices`)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })
}

// Unused - it could be called inside the `UpdateDialog` but there was already implemented to pass in row data
export function getDeviceById(id) {
  return api
    .get(`/device`, id)
    .then(({ data }) => {
      console.log(`inside devices.js ${data}`)
      return data
    })
    .catch((err) => {
      throw err
    })
}

export function createDevice(newDevice) {
  return api
    .post(`/devices`, newDevice)
    .then(({ data }) => {
      console.log(`inside devices.js ${data}`)
      return data
    })
    .catch((err) => {
      throw err
    })
}

export function updateDevice(id, device) {
  return api
    .put(`/device/${id}`, device)
    .then(({ data }) => {
      console.log(`inside devices.js ${data}`)
      return data
    })
    .catch((err) => {
      throw err
    })
}

export function deleteDevice(id) {
  return api
    .delete(`/device/${id}`)
    .then(({ data }) => {
      console.log(`inside devices.js ${data}`)
      return data
    })
    .catch((err) => {
      throw err
    })
}
