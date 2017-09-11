/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'MASTER_INDUSTRY',

  findByIndustryCode: function (industryCode, cb) {
    var query = 'SELECT * FROM ?? WHERE INDUSTRY_CODE = ?? ASC';
    var data = [this.table, condition];
    utils.exec(query, data, cb);
  },

  listIndustryCode: function ( cb ) {
    var query = 'SELECT * FROM ??';
    var data = [this.table];
    utils.exec(query, data, cb);
  }

}
