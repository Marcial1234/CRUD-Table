import { api } from '@/lib/utils'

export function getAllDevices() {
  return api
    .get(`/devices`)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })
}

export function createDevice(newDevice) {
  return api
    .post(`/devices`, newDevice)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })
}

export function updateDevice(id, device) {
  return api
    .put(`/devices/${id}`, device)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })
}

export function deletePost(id) {
  return api
    .put(`/devices/${id}`)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })
}
