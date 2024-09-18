import express from 'express'

import {
  addDevice,
  deleteDevice,
  getDevice,
  getDevices,
  resetDevices,
  updateDevice,
} from '../controllers/devices'

module.exports = (app) => {
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
}
