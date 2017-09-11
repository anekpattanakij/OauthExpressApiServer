/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'RESET_PASSWORD_LIST',

  insertForgetPasswordKey: function (cif,resetKey, cb) {
    var query = 'INSERT INTO ?? (CIF,RESET_KEY) VALUES (?,?)';
    var data = [this.table, cif,resetKey];
    utils.exec(query, data, cb);
  },

  getByCif: function (cif, cb ) {
    var query = 'SELECT * FROM ?? WHERE CIF=?';
    var data = [this.table,cif];
    utils.exec(query, data, cb);
  },

  getByForgetPasswordKey: function (resetKey, cb ) {
    var query = 'SELECT * FROM ?? WHERE RESET_KEY=?';
    var data = [this.table,resetKey];
    utils.exec(query, data, cb);
  },

  removeForgetPasswordKey: function ( cif,cb ) {
    var query = 'DELETE FROM ?? WHERE CIF=?';
    var data = [this.table,cif];
    utils.exec(query, data, cb);
  }

}
