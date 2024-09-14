module.exports = (app) => {
  app.use('/api/seed', (_, res) => {
    /*
     * Feature flag `seed`, to be stored in the browser's `localStorage`:
     *   0) zustand
     *   1) Tan/React Query
     *   2) `useState` gallore
     */
    res.json(Math.floor(Math.random() * 3))
  })
}
