/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'MASTER_TIMEZONE',

  findByTimezoneCode: function (countryCode, cb) {
    var query = 'SELECT * FROM ?? WHERE TIMEZONE_CODE = ??';
    var data = [this.table, condition];
    utils.exec(query, data, cb);
  },

  listTimezone: function ( cb ) {
    var query = 'SELECT * FROM ?? order by TIMEZONE_VALUE,TIMEZONE_CODE';
    var data = [this.table];
    utils.exec(query, data, cb);
  }

}
