import express from 'express'

import {
  addDevice,
  deleteDevice,
  getDevice,
  getDevices,
  updateDevice,
} from '../controllers/devices'

module.exports = (app) => {
  const router = express.Router()
  router.route('/devices')
    .get(getDevices)
    .post(addDevice)

  router.route('/devices/:id')
    .get(getDevice)
    .put(updateDevice)
    .delete(deleteDevice)

  app.use('/api', router)
}
