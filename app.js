// Use Babel translate ECMAScript 2015 และ JSX
//require('babel-register');

// for start้ start server
//require('./app/server.js');


var restify = require('restify');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var config = require('config');
var cluster = require('cluster');
var http = require('http');
var redis = require('redis');
var oauthserver = require('oauth2-server');

//If node_env doesn't set -> defeult as development
if(!process.env.NODE_ENV)
{
  console.log('NODE_ENV not found, default as development');
  process.env.NODE_ENV = 'development';
}
// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

// Code to run if we're in a worker process
} else {
  var app = restify.createServer();
  app.use(restify.acceptParser(app.acceptable));
  app.use(restify.dateParser());
  app.use(restify.queryParser());
  app.use(restify.jsonp());
  app.use(restify.gzipResponse());
  app.use(restify.bodyParser());
  
  //Set OAuthServer
  // Add body parser.
  app.use(restify.bodyParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.oauth = oauthserver({
    model: require('./app/lib/oauthModel'),
    grants: ['password','refresh_token'],
    accessTokenLifetime:3600,
    refreshTokenLifetime: 1209600,
    debug: true
  });
  app.post('/oauth/token', app.oauth.grant());

  app.use(cookieParser());
  // for calling x-site from web tier
  app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', config.get('WEB_HOST'));
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      if ('OPTIONS' == req.method)
      {
        res.sendStatus(200);
      }
      else {
        next();
      }
  });

  // Bootstrap passport config
  require('./routes/apiRoute')(app);

  /* In case, have many route in the future, we will use this code
  var fs = require ('fs');
  fs.readdirSync('snippets').forEach(function(file) {
    if ( file[0] == '.' ) return;
    var routeName = file.substr(0, file.indexOf('.'));
    require('./routes/' + routeName)(k app,passport);
  });
  */

  // error handlers
  //require('./app/lib/errorHandler')(app);

  console.log("Start API Server @ port " + config.get("HTTPPORT") + " with " + process.env.NODE_ENV + " cpu : " + + cluster.worker.id);
  app.listen(config.get("HTTPPORT"), function() {
    console.log('listening: %s', config.get("HTTPPORT"));
    });
}
