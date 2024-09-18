import { api } from '@/lib/utils'

export const getAllDevices = () =>
  api
    .get(`/devices`)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })

// Unused - it could be called inside the `UpdateDialog` but it was implemented to pass in row data
export const getDeviceById = (id) =>
  api
    .get(`/devices`, id)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })

export const createDevice = (newDevice) =>
  api
    .post(`/devices`, newDevice)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })

export const updateDevice = (id, device) =>
  api
    .put(`/devices/${id}`, device)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })

export const deleteDevice = (id) =>
  api.delete(`/devices/${id}`).catch((err) => {
    throw err
  })

export const resetDevices = () =>
  api
    .delete(`/devices`)
    .then(({ data }) => data)
    .catch((err) => {
      throw err
    })
