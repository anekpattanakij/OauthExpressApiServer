/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'MASTER_COUNTRY',

  findByCountryCode: function (countryCode, cb) {
    var query = 'SELECT * FROM ?? WHERE COUNTRY_CODE = ??';
    var data = [this.table, condition];
    utils.exec(query, data, cb);
  },

  listCountry: function ( cb ) {
    var query = 'SELECT * FROM ??';
    var data = [this.table];
    utils.exec(query, data, cb);
  }

}
