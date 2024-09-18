import { api } from '@/lib/utils'

export const getAllDevices = () =>
  api
    .get(`/devices`)
    .then(({ headers, data }) =>
      headers['content-type'].includes(
        'text/html' /* this means there's an API url/port/config error */,
      )
        ? []
        : data,
    )
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

export const updateDevice = (device) =>
  api
    .put(`/devices/${device.get('id')}`, device)
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
