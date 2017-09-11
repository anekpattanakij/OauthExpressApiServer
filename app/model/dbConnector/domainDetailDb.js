/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'DOMAIN_DETAIL',

  listByDomainName: function (companyId, callback) {
    var query = 'SELECT * FROM ?? WHERE DOMAIN_NAME = ?';
    var data = [this.table, companyId];
    utils.exec(query, data, callback);
  },

  save: function (domainName,domainDetailObject, callback) {
    var query = 'INSERT INTO ?? (DOMAIN_NAME,RECORD_NAME,RECORD_TYPE,RECORD_STATUS,VALUE) VALUES (?,?,?,?,?)';
    var data = [this.table,domainName,domainDetailObject.recordName,domainDetailObject.recordType,domainDetailObject.recordStatus,domainDetailObject.value];
    utils.exec(query, data, callback);
  },

  update: function (domainName,domainDetailObject, callback) {
    var query = 'UPDATE ?? SET RECORD_STATUS = ?,VALUE = ? WHERE DOMAIN_NAME = ? AND RECORD_NAME = ?';
    var data = [this.table,domainDetailObject.recordStatus,domainDetailObject.value,domainName,domainDetailObject.recordName];
    utils.exec(query, data, callback);
  },

  delete: function (domainName, callback) {
    var query = 'DELETE FROM ?? WHERE DOMAIN_NAME = ?';
    var data = [this.table,domainName];
    utils.exec(query, data, callback);
  }
}
