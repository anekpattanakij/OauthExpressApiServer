/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'COMPANY_DOMAIN',

  listByCompanyId: function (companyId, callback) {
    var query = 'SELECT * FROM ?? WHERE COMPANY_ID = ?';
    var data = [this.table, companyId];
    utils.exec(query, data, callback);
  },

  listByDomainName: function (domainName, callback) {
    var query = 'SELECT * FROM ?? WHERE DOMAIN_NAME = ?';
    var data = [this.table, domainName];
    utils.exec(query, data, callback);
  },

  save: function (companyId,domainObject, callback) {
    var query = 'INSERT INTO ?? (COMPANY_ID,DOMAIN_NAME,DOMAIN_STATUS) VALUES (?,?,?)';
    var data = [this.table,companyId,domainObject.domainName,domainObject.status];
    utils.exec(query, data, callback);
  },

  update: function (companyId,domainObject, callback) {
    var query = 'UPDATE ?? SET DOMAIN_STATUS = ? WHERE COMPANY_ID = ? AND DOMAIN_NAME = ?';
    var data = [this.table,domainObject.status,companyId,domainObject.domainName];
    utils.exec(query, data, callback);
  },

  delete: function (companyId,domainName, callback) {
    var query = 'DELETE FROM ?? WHERE COMPANY_ID = ? AND DOMAIN_NAME = ?';
    var data = [this.table,companyId,domainName];
    utils.exec(query, data, callback);
  }
}
