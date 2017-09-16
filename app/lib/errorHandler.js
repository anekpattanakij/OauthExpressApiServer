module.exports = function (app, passport) {
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    console.log(req.originalUrl);
    res.status(404).send('error.notfound');
  });

  // development error handler
  // will print stacktrace

  app.use(function(err, req, res, next) {
    if (process.env.NODE_ENV == 'development') {
      console.log(err);
    }
    res.status(400).send(err.message);
  });

}
