/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'MASTER_ROLE',

  findByRoleCode: function (industryCode, cb) {
    var query = 'SELECT * FROM ?? WHERE ROLE_ID = ?? ASC';
    var data = [this.table, condition];
    utils.exec(query, data, cb);
  },

  listRoleCode: function ( cb ) {
    var query = 'SELECT * FROM ??';
    var data = [this.table];
    utils.exec(query, data, cb);
  }

}
