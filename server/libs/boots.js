module.exports = (app) =>
  app.listen(app.get('port'), () =>
    console.log(`Open browser to http://localhost:${app.get('port')}`),
  )
