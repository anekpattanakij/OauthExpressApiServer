import  express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'
import session from 'express-session';
import flash from 'connect-flash';
import config from 'config';
import cluster from 'cluster';
import http from 'http';
import redis from 'redis';
import oauthserver from 'oauth2-server';
import connectRedis from 'connect-redis';
import aws from 'aws-sdk';
var redisStore = connectRedis(session);
aws.config.update({
  endpoint: config.get("DYNAMODB_HOST")
});

//If node_env doesn't set -> defeult as development
if(!process.env.NODE_ENV)
{
  console.log('NODE_ENV not found, default as development');
  process.env.NODE_ENV = 'development';
}
// Code to run if we're in the master process
if (cluster.isMaster && process.env.NODE_ENV !== 'development') {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

// Code to run if we're in a worker process
} else {
  var app = express();

  app.use(flash());
  var redisClient  = redis.createClient();
  app.use(session({
    secret: 'adsSortSessionKey',
    // create new redis store.
    store: new redisStore({ host: config.get("REDIS_HOST"), port: config.get("REDIS_PORT"), client: redisClient,ttl :  6000, cookie:{maxAge:6000}}),
    saveUninitialized: false,
    resave: true
  }));

  //Set OAuthServer
  // Add body parser.
  app.use(bodyParser.json());
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

  //require('./routes/apiRoute')(app);

  /* In case, have many route in the future, we will use this code
  var fs = require ('fs');
  fs.readdirSync('snippets').forEach(function(file) {
    if ( file[0] == '.' ) return;
    var routeName = file.substr(0, file.indexOf('.'));
    require('./routes/' + routeName)(k app,passport);
  });
  */

  // error handlers
  require('./app/lib/errorHandler')(app);


  // console.log("Start API Server @ port " + config.get("HTTPPORT") + " with " + process.env.NODE_ENV + " cpu : " + cluster.worker.id);
  console.log("Start API Server @ port " + config.get("HTTPPORT") + " with " + process.env.NODE_ENV);
  http.createServer(app).listen(config.get("HTTPPORT"));
}
