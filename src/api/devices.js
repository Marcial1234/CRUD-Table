import { api } from '@/lib/utils'

export async function getAllDevices() {
  try {
    const {headers, data } = await api.get(`/devices`)
    return headers['content-type'].includes(
      /* this means there's an API url/port/config error */
      'text/html',
    )
      ? []
      : data
  } catch(err) {throw err}
}

// Unused - it could be called inside the `UpdateDialog` but it was implemented to pass in row data
export async function getDeviceById(id) {
  try {
    const {data} = await api.get(`/devices`, id)
    return data
  } catch(err) {throw err}
}

export async function createDevice(newDevice) {
  try {
    const {data} = await api.post(`/devices`, newDevice)
    return data
  } catch(err) {throw err}
}

export async function updateDevice(device) {
    try {
    const {data} = await api.put(`/devices/${device.id}`, device)
    return data
  } catch(err) {throw err}
}

export async function deleteDevice(id) {
  try {
    const {status} = await api.delete(`/devices/${id}`)
    if (status !== 204) throw new Error(`Server responded with incorrect HTTP code ${status} instead of 204`)
    return
  } catch(err) {throw err}
}

export async function resetDevices() {
  try {
    const {data} = await api.delete(`/devices`)
    return data
  } catch(err) {throw err}
}
