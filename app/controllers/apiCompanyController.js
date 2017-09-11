var User = require('./../model/user');
var UserProfile = require('./../model/userProfile');
var Role = require('./../model/role');
var Company = require('./../model/company');
var InvitationUser = require('./../model/invitationUser');
const uuid = require('node-uuid');

module.exports = {

  updateCompanyProfile: function(request, response){
    //TODO remove session dependency
    //TODO check authorisea
    if( !request.body.country || !request.body.industry || !request.body.companyName || !request.body.companyId)
    {
      return response.status(400).send('error.input.invalid');
    }
    var companyObject = new Company();
    companyObject.companyId = request.body.companyId;
    companyObject.companyName = request.body.companyName;
    companyObject.companyUrl = request.body.companyUrl;
    companyObject.address1 = request.body.companyAddress1;
    companyObject.address2 = request.body.companyAddress2;
    companyObject.city = request.body.companyCity;
    companyObject.state = request.body.companyState;
    companyObject.postalCode = request.body.companyPostalCode;
    companyObject.country = request.body.country;
    companyObject.industryCode = request.body.industry;
    Company.prototype.updateCompanyProfile(companyObject, function(err, companyObject)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      //TODO Update company in the user object on session site
      /*for(var i=0;i<request.user.role.length;i++)
      {
        var roleObject = request.user.role[i];
        if(roleObject.company.companyId == companyObject.companyId)
        {
          request.user.role[i].company = companyObject;
          break;
        }
      };*/
      return response.status(200).end();
    });
  },

  addUserToCompany: function(request, response){
    //TODO Add custom role
    //TODO remove session dependency
    //TODO check authorise
    if( !request.body.email || !request.body.role || !request.body.company)
    {
      return response.status(400).send('error.input.invalid');
    }
    if( request.body.email == request.user.user.email)
    {
      return response.status(400).send('error.user.addUserToCompany.notAllowAddSelf');
    }
    InvitationUser.prototype.listByEmailAndCompany(request.body.email,request.body.company, function(err,returnInvitaionList)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      if(returnInvitaionList.length>0)
      {
        return response.status(400).send('error.user.addUserToCompany.alreadyInvited');
      }
      var invitationUserObject = new InvitationUser();
      invitationUserObject.email = request.body.email;
      invitationUserObject.companyId = request.body.company;
      invitationUserObject.inviteKey = uuid.v4();
      invitationUserObject.roleId = request.body.role;
      //invitationUserObject.roleCustom;
      invitationUserObject.inviteStatus = InvitationUser.prototype.ACTIVE_STATUS;
      invitationUserObject.inviteBy = request.user.user.cif;
      InvitationUser.prototype.inviteUserToCompany(invitationUserObject,function(err)
      {
        if(err)
        {
          console.log(err);
          return response.status(400).send('error.db.error');
        }
        //TODO send invitaion e-mail
        return response.status(200).end();
      });
    });
  },

  findByCompanyId: function(request, response){
    //TODO Add custom role
    //TODO remove session dependency
    //TODO check authorise
    if( !request.body.companyId )
    {
      return response.status(400).send('error.input.invalid');
    }
    Company.prototype.findByCompanyId(request.body.companyId, function(err,companyList)
    {
      if(err)
      {
        console.log(err);
        return response.status(400).send('error.db.error');
      }
      return response.status(200).end(JSON.stringify(companyList));
    });
  }
}
