/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'REL_USER_ROLE_COMPANY',

  find: function (condition, callback) {
    var query = 'SELECT * FROM ?? WHERE ?';
    var data = [this.table, condition];
    utils.exec(query, data, cb);
  },

  findByCifCompany: function (id, companyId, callback) {
    var query = 'SELECT * FROM ?? WHERE CIF = ? AND COMPANY_ID =?';
    var data = [this.table, id,companyId];
    var connection = utils.getDBConnection();
    utils.exec(query, data, callback);
  },

  findByCif: function (id, callback) {
    var query = 'SELECT * FROM ?? WHERE CIF = ?';
    var data = [this.table, id];
    var connection = utils.getDBConnection();
    utils.exec(query, data, callback);
  },

  save: function (cif,companyId,roleId,roleCustom, callback) {
    var query = 'INSERT INTO ?? (CIF,COMPANY_ID,ROLE_ID,ROLE_CUSTOM) VALUES (?,?,?,?)';
    var data = [this.table,cif,companyId,roleId,roleCustom];
    var connection = utils.getDBConnection();
    utils.exec(query, data, callback);
  }

}
