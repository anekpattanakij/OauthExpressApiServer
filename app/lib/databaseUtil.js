var mysql = require('mysql');
var config = require('config');

module.exports = {
  getDBConnection: function () {
    return mysql.createConnection({
      host     : config.get("MYSQL_HOST"),
      user     : config.get("MYSQL_USER"),
      password : config.get("MYSQL_PASSWORD"),
      database : config.get("MYSQL_DATABASE")
    });
  },

  /**
   * This must be called before connection.query(...);
   */
  connectToDB: function (connection) {
    connection.connect(function(err) {
      if (err) {
        throw err;
      }
    });
  },

  /**
   * This must be called after connection.query(...)
   */
  endDBConnection: function (connection) {
    connection.end(function (err) {
      if (err) {
        throw err;
      }
    });
  },

  exec: function (query, data, cb) {
    var connection = this.getDBConnection();
    this.connectToDB(connection);
    connection.query(query, data, function(err, res) {
      if (err) {
        cb(err);
      } else
      {
        cb(null, res);
      }
    });
    this.endDBConnection(connection);
  },

  transactionExec: function(queryData, cb)
  {
    //remark queryData = array of {queryString : '', queryData :''}
    var connection = this.getDBConnection();

    var internalLoopPromise = function (queryData, connection, promise, step, cb) {
      return promise.then (
        function()
        {
          if(step < queryData.length)
          {
            connection.query(queryData[step].queryString, queryData[step].queryData, function(err, result) {
              if (err) {
                return connection.rollback(function() {
                  connection.end(function (err) {
                    if (err) {
                      cb(err); // throw error for end connection
                    }
                  });
                  cb(err); // throw error for commmit
                });
              }
              step++;
              internalLoopPromise(queryData, connection, promise, step, cb);
            });
          } else {
            connection.commit(function(err) {
                if (err) {
                  return connection.rollback(function() {
                    //this.endDBConnection(connection);
                    cb(err);
                  });
                }
              });
              connection.end(function (err) {
                if (err) {
                  cb(err); // throw error for end connection
                }
                cb(null);
              });
            };
        });
    };

    connection.beginTransaction(function(err) {
      if (err) { cb(err); }
        var step = 0;
        internalLoopPromise(queryData,connection,promise.resolve(0),step,cb);
    });
  }
}
