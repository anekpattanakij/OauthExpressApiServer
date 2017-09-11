var utils = require('./../../lib/databaseUtil');
var roleDb = require('./roleDb');

module.exports = {
    table: 'INVITATION_USER_COMPANY',

    findByEmail: function (id, callback) {
      var query = 'SELECT * FROM ?? WHERE EMAIL = ?';
      var data = [this.table, id];
      utils.exec(query, data, callback);
    },

    findByInviteKey: function (id, callback) {
      var query = 'SELECT * FROM ?? WHERE INVITE_KEY = ?';
      var data = [this.table, id];
      utils.exec(query, data, callback);
    },

    findByCompany: function (id, callback) {
      var query = 'SELECT * FROM ?? WHERE COMPANY_ID = ?';
      var data = [this.table, id];
      utils.exec(query, data, callback);
    },

    findByEmailAndCompany: function (email,companyId, callback) {
      var query = 'SELECT * FROM ?? WHERE EMAIL = ? AND COMPANY_ID = ?';
      var data = [this.table, email,companyId];
      utils.exec(query, data, callback);
    },

    saveUserInviteToCompany: function (invitationUser, callback) {
      var insertUserSql = 'INSERT INTO ?? (EMAIL,COMPANY_ID,ROLE_ID,ROLE_CUSTOM,INVITE_KEY,INVITE_STATUS,INVITE_BY,INVITE_DATE,UPDATED_BY,UPDATED_DATE) VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,CURRENT_TIMESTAMP)';
      var insertUserData = [this.table,invitationUser.email,invitationUser.companyId,invitationUser.roleId,invitationUser.roleCustom,invitationUser.inviteKey,invitationUser.inviteStatus ,invitationUser.inviteBy,invitationUser.inviteBy];
      utils.exec(insertUserSql, insertUserData, callback);
    },

    updateUserInviteStatus: function (currentUser,inviteEmail,companyId,status, callback) {
      var updateInviteSql = 'UPDATE ?? SET INVITE_STATUS=?,UPDATED_BY=?,UPDATED_DATE=CURRENT_TIMESTAMP WHERE EMAIL=? AND COMPANY_ID=?';
      var updateInviteData = [this.table,status,currentUser,inviteEmail,companyId];
      utils.exec(updateInviteSql, updateInviteData, callback);
    },

    acceptUserInviteStatus: function (cif,invitation,acceptStatus,callback) {
      var insertRoleSql = 'INSERT INTO ?? (CIF,COMPANY_ID,ROLE_ID,ROLE_CUSTOM) VALUES (?,?,?,?)';
      var insertRoleData = [roleDb.table,cif,invitation.companyId,invitation.roleId,invitation.roleCustom];
      var updateInviteSql = 'UPDATE ?? SET INVITE_STATUS=?,UPDATED_BY=?,UPDATED_DATE=CURRENT_TIMESTAMP WHERE EMAIL=? AND COMPANY_ID=?';
      var updateInviteData = [this.table,acceptStatus,cif,invitation.email,invitation.companyId];
      var insertDataList = [];
      insertDataList.push({queryString : insertRoleSql, queryData :insertRoleData});
      insertDataList.push({queryString : updateInviteSql, queryData :updateInviteData});
      utils.transactionExec(insertDataList, callback);
    }
  }
