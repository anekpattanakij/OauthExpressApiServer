/**
 * Module dependencies.
 */

import redis from 'redis';
import config from 'config';
import {format} from 'util';
const db = redis.createClient(config.get("REDIS_PORT"),config.get("REDIS_HOST"));

/**
 * Redis formats.
 */

var formats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s'
};

/**
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken,callback) {
  console.log(bearerToken);
  return db.get(format(formats.token, bearerToken), function(err,token) {
      if (!token) {
        return callback(err);
      }
      return callback(null,JSON.parse(token));
    });
};

/**
 * Get client.
 */

module.exports.getClient = function(clientId, clientSecret,callback) {
  return callback(null,{
    clientId: 'client',
    clientSecret: 'secret'
  });
  /*return db.hgetall(fmt(formats.client, clientId),function(err,client) {
      if(err){
        return callback(err);
      }
      if (!client || client.clientSecret !== clientSecret) {
        return;
      }

      return callback(null,{
        clientId: client.clientId,
        clientSecret: client.clientSecret
      });
    });*/
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function(bearerToken,callback) {
  return db.get(format(formats.token, bearerToken), function(err,token) {
    if (!token) {
      return callback(err);
    }
    return callback(null,JSON.parse(token));
  });
};

/**
 * Get user.
 */

module.exports.getUser = function(username, password,callback) {
  //bypass because trust checking from login service
  return callback(null,username);
};

/**
 * Save token.
 */

module.exports.saveAccessToken = function(token, client, expires, user,callback) {
  var data = {
    accessToken: token,
    expires: expires,
    clientId: client,
    user: user
  };
  db.set(format(formats.token, token), JSON.stringify(data));
  return callback(null);
};

module.exports.saveRefreshToken = function(token, client, expires, user,callback) {
  var data = {
    clientId: client,
    refreshToken: token,
    expires: expires,
    user: user
  };
  db.set(format(formats.token, token), JSON.stringify(data));
  return callback(null);
};

module.exports.grantTypeAllowed = function(clientId, grantType,callback) {
  return callback(null,true); //always allow
};

//For Revoke Token After Logout
module.exports.revokeRefreshToken = function(token, callback)
{
  db.del(format(formats.token, token));
  return callback(null); //always allow
};

//For Revoke Token After Logout
module.exports.revokeAccessToken = function(token, callback)
{
  db.del(format(formats.token, token));
  return callback(null); //always allow
};
