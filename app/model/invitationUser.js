var InviteUserDb    = require('./dbConnector/inviteUserDb');


InvitationUser.prototype.ACTIVE_STATUS = 1;
InvitationUser.prototype.CANCEL_STATUS = 2;
InvitationUser.prototype.EXPIRED_STATUS = 3;
InvitationUser.prototype.ACCEPT_STATUS = 4;

function InvitationUser() {
  var email,companyId,inviteKey,roleId,roleCustom,inviteStatus,inviteBy;
}

InvitationUser.prototype.createObjectFromDb = function( newInvitaionDetail )
{
  var newInvitaionObject = new InvitationUser();
  newInvitaionObject.email = newInvitaionDetail.EMAIL;
  newInvitaionObject.companyId = newInvitaionDetail.COMPANY_ID;
  newInvitaionObject.inviteKey = newInvitaionDetail.INVITE_KEY;
  newInvitaionObject.roleId = newInvitaionDetail.ROLE_ID;
  newInvitaionObject.roleCustom = newInvitaionDetail.ROLE_CUSTOM;
  newInvitaionObject.inviteStatus = newInvitaionDetail.INVITE_STATUS;
  newInvitaionObject.inviteBy = newInvitaionDetail.INVITE_BY;
  return newInvitaionObject;
}


InvitationUser.prototype.inviteUserToCompany = function(newInvitaionDetail,callback)
{
  InviteUserDb.saveUserInviteToCompany(newInvitaionDetail,function(err)
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};

InvitationUser.prototype.checkInviteKey = function(inviteKey,callback)
{
  InviteUserDb.findByInviteKey(inviteKey,function(err,invitationList)
  {
    var result = [];
    if(err)
    {
      return callback(err);
    }
    if(invitationList.length == 0 )
    {
      return callback(null,result);
    }
    invitationList.forEach( function(invitationDetail) {
      var returnInvitation = InvitationUser.prototype.createObjectFromDb(invitationDetail);
      result.push(returnInvitation);
    });
    return callback(null,result);
  });
};

InvitationUser.prototype.listByEmailAndCompany = function(email,companyId,callback)
{
  InviteUserDb.findByEmailAndCompany(email,companyId,function(err,invitationList)
  {
    if(err)
    {
      return callback(err);
    }
    var result = [];
    if(invitationList.length == 0 )
    {
      return callback(null,result)
    }
    invitationList.forEach( function(invitationDetail) {
      var returnInvitation = InvitationUser.prototype.createObjectFromDb(invitationDetail);
      result.push(returnInvitation);
  });
  return callback(null,result) });
};

InvitationUser.prototype.acceptUserInvite = function(cif,invitation,callback)
{
  InviteUserDb.acceptUserInviteStatus(cif,invitation,InvitationUser.prototype.ACCEPT_STATUS,function(err,invitationList)
  {
    if(err)
    {
      return callback(err);
    } else return callback(null);
  });
};

/*
InviationUser.prototype.cancelInviteUserToCompany = function(currentUserCif,removeEmail,companyId,callback)
{
  InviteUserDb.deleteUserInvite(currentUser,removeEmail,companyId,function(err)
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};
*/
module.exports = InvitationUser;
