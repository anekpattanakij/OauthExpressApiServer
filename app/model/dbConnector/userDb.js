var utils = require('./../../lib/databaseUtil');
var roleDb = require('./roleDb');
var companyDb = require('./companyDb');
var InviteUserDb    = require('./inviteUserDb');

module.exports = {
  table: 'USER',

  find: function (condition, callback) {
    var query = 'SELECT * FROM ?? WHERE ?';
    var data = [this.table, condition];
    utils.exec(query, data, cb);
  },

  findByEmail: function (id, callback) {
    var query = 'SELECT * FROM ?? WHERE EMAIL = ?';
    var data = [this.table, id];
    utils.exec(query, data, callback);
  },

  findByCif: function (id, callback) {
    var query = 'SELECT * FROM ?? WHERE CIF = ?';
    var data = [this.table, id];
    utils.exec(query, data, callback);
  },

  updateUserInformation: function (user, callback) {
    var query = 'UPDATE ?? SET EMAIL=?,PASSWORD=?, FIRSTNAME=?,LASTNAME=?,TIMEZONE_CODE=?,STATUS=?,UPDATED_BY=\'system\',UPDATED_DATE=CURRENT_TIMESTAMP WHERE CIF = ?';
    var data = [this.table, user.email, user.password,user.firstname, user.lastname, user.timezoneCode, user.status, user.cif];
    utils.exec(query, data, callback);
  },

  /**
   * Create new user record to database
   */
  saveUserProfile: function (userProfile, callback) {
    var insertUserSql = 'INSERT INTO ?? (CIF,EMAIL,PASSWORD,FIRSTNAME,LASTNAME,TIMEZONE_CODE,STATUS,CREATED_BY,UPDATED_BY,UPDATED_DATE,CREATED_DATE) VALUES (?,?,?,?,?,?,?,\'system\',\'system\',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)';
    var insertUserData = [this.table,userProfile.user.cif,userProfile.user.email,userProfile.user.password,userProfile.user.firstname,userProfile.user.lastname,userProfile.user.timezoneCode, userProfile.user.status];
    var roleObject = userProfile.role[0];
    var companyObject = roleObject.company;
    var insertCompanySql = 'INSERT INTO ?? (COMPANY_ID,COMPANY_NAME,COMPANY_URL,ADDRESS1,ADDRESS2,CITY,STATE,POSTAL_CODE,COUNTRY_CODE,INDUSTRY_CODE) VALUES (?,?,?,?,?,?,?,?,?,?)';
    var insertCompanyData = [companyDb.table,companyObject.companyId,companyObject.companyName,companyObject.companyUrl,companyObject.address1,companyObject.address2,companyObject.city,companyObject.state,companyObject.postalCode,companyObject.country,companyObject.industryCode];
    var insertRoleSql = 'INSERT INTO ?? (CIF,COMPANY_ID,ROLE_ID) VALUES (?,?,?)';
    var insertRoleData = [roleDb.table,userProfile.user.cif,companyObject.companyId,roleObject.roleId];
    var insertDataList = [];
    insertDataList.push({queryString : insertUserSql, queryData :insertUserData});
    insertDataList.push({queryString : insertCompanySql, queryData :insertCompanyData});
    insertDataList.push({queryString : insertRoleSql, queryData :insertRoleData});
    utils.transactionExec(insertDataList, callback);
  },

  /**
   * Create new user record to database
   */
  saveUserProfileToExistingCompany: function (userProfile,invitation, callback) {
    var updateInviteSql = 'UPDATE ?? SET INVITE_STATUS=?,UPDATED_BY=?,UPDATED_DATE=CURRENT_TIMESTAMP WHERE EMAIL=? AND COMPANY_ID=?';
    var updateInviteData = [InviteUserDb.table,invitation.inviteStatus,userProfile.user.cif,invitation.email,invitation.companyId];
    var insertUserSql = 'INSERT INTO ?? (CIF,EMAIL,PASSWORD,FIRSTNAME,LASTNAME,TIMEZONE_CODE,STATUS,CREATED_BY,UPDATED_BY,UPDATED_DATE,CREATED_DATE) VALUES (?,?,?,?,?,?,?,\'system\',\'system\',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)';
    var insertUserData = [this.table,userProfile.user.cif,userProfile.user.email,userProfile.user.password,userProfile.user.firstname,userProfile.user.lastname,userProfile.user.timezoneCode, userProfile.user.status];
    var roleObject = userProfile.role[0];
    var companyObject = roleObject.company;
    var insertRoleSql = 'INSERT INTO ?? (CIF,COMPANY_ID,ROLE_ID) VALUES (?,?,?)';
    var insertRoleData = [roleDb.table,userProfile.user.cif,companyObject.companyId,roleObject.roleId];
    var insertDataList = [];
    insertDataList.push({queryString : updateInviteSql, queryData :updateInviteData});
    insertDataList.push({queryString : insertUserSql, queryData :insertUserData});
    insertDataList.push({queryString : insertRoleSql, queryData :insertRoleData});
    utils.transactionExec(insertDataList, callback);
  },

  getUserListByCompanyId: function (id, callback) {
    var query = 'SELECT * FROM ?? WHERE CIF IN (SELECT CIF FROM ?? WHERE COMPANY_ID =?';
    var data = [this.table,roleDb.table,id];
    utils.exec(query, data, callback);
  }

}
