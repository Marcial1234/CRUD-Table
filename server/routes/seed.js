module.exports = (app) =>
  /*
   * NOTE: NOT IMPLEMENTED
   * Feature flag `seed`, to be stored in the browser's `localStorage`:
   *   0) zustand
   *   1) Tan/React Query
   *   2) `useState` gallore
   */
  app.use('/api/seed', (_, res) => res.json(Math.floor(Math.random() * 3)))
