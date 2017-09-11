/**
 * Module Dependencies
 */
var utils = require('./../../lib/databaseUtil');

module.exports = {
  table: 'COMPANY',

  findByCompanyId: function (id, cb) {
    var query = 'SELECT * FROM ?? WHERE COMPANY_ID = ?';
    var data = [this.table, id];
    utils.exec(query, data, cb);
  },

  updateCompanyInformation: function (company, callback) {
    var query = 'UPDATE ?? SET COMPANY_NAME=?,COMPANY_URL=?,ADDRESS1=?,ADDRESS2=?,CITY=?,STATE=?,POSTAL_CODE=?,COUNTRY_CODE=?,INDUSTRY_CODE=? WHERE COMPANY_ID = ?';
    var data = [this.table,company.companyName,company.companyUrl,company.address1,company.address2,company.city,company.state,company.postalCode,company.country,company.industryCode, company.companyId];
    utils.exec(query, data, callback);
  },
  /**
   * Create new user record to database
   */
  save: function (user, cb) {
    var query = 'INSERT INTO users SET ?';
    //var data = [this.table, user.cif,user.email,user.firstname,user.lastname,user.password;];
    utils.exec(query, user, cb);
  }

}
