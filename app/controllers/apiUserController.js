var User = require('./../model/user');
var invitationUser = require('./../model/InvitationUser');
var oauthModel = require('./../lib/oauthModel');
var Promise = require('bluebird');
const uuid = require('node-uuid');

module.exports = {

  updateUserProfile: function(request, response){
    if( !request.body.username|| !request.body.firstname || !request.body.lastname || !request.body.timezone )
    {
      return response.status(400).send('error.input.invalid');
    }
    User.prototype.findByEmail( request.body.username, function(err,userList)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      if(userList.length > 1)
      {
        return response.status(400).send('error.user.updateProfile.emailInUse');
      }
      var userProfile = request.user;
      var userObject = userProfile.user;
      userObject.email = request.body.username;
      userObject.firstname = request.body.firstname;
      userObject.lastname = request.body.lastname;
      userObject.timezoneCode = request.body.timezone;
      User.prototype.updateUserProfile(userObject, function(err, userObject)
      {
        if(err)
        {
          return response.status(400).send('error.db.error');
        }
        //TODO update user profile in the toke store.
        //oauthModel.getAccessToken(bearerToken,callback)
        //oauthModel.saveAccessToken(token, client, expires, user,callback)
        //oauthModel.getRefreshToken(bearerToken,callback)
        //oauthModel.saveRefreshToken(token, client, expires, user,callback)
        request.user.user = userObject;
        return response.status(200).end();
      });
    });
  },

  findUserByEmail: function(request, response){
    if( !request.body.email )
    {
      return response.status(400).send('error.input.invalid');
    }
    User.prototype.findByEmail(request.body.email,function(err,user)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      return response.status(200).end(JSON.stringify(user));
    });
  },

  getUserListByCompanyId: function(request, response){
    if( !request.body.companyId )
    {
      return response.status(400).send('error.input.invalid');
    }
    User.prototype.getUserListByCompanyId(request.body.companyId,function(err,user)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      return response.status(200).end(JSON.stringify(user));
    });
  },

  cancelUser: function(request, response){
    User.prototype.cancelUser(request.user.user,function(err)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      return response.status(200).end();
    });
  },

  changePassword: function(request, response){
    if( !request.body.currentPassword|| !request.body.newPassword )
    {
      return response.status(400).send('error.input.invalid');
    }
    var userProfile = request.user;
    var userObject = userProfile.user;
    if( User.prototype.authenticate(userObject, request.body.currentPassword) )
    {
      userObject.password = User.prototype.encryptPassword(request.body.newPassword);
      User.prototype.updateUserProfile(userObject, function(err, userObject)
      {
        if(err)
        {
          return response.status(400).send('error.db.error');
        }
        request.user.user = userObject;
        return response.status(200).end();
      });
    } else {
      return response.status(400).send('error.user.changePassword.wrongPassword');
    }
    return response.status(200).end();
  },

  forgetPassword: function(request, response){
    if( !request.body.email )
    {
      return response.status(400).send('error.input.invalid');
    }
    User.prototype.findByEmail( request.body.email, function(err,userList)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      if(userList.length < 1)
      {
        return response.status(400).send('error.user.findByEmail.emailNotFound');
      }
      var promise = new Promise(
         function(resolve, reject) {
           User.prototype.removeForgetPasswordKey(userList[0].cif,function(err)
           {
             if(err)
             {
               reject();
             }
             resolve();
           });
         });
      promise.then( function() {
          var newResetKey = uuid.v4();
          User.prototype.insertForgetPasswordKey(userList[0].cif,newResetKey,function(err)
          {
            if(err)
            {
              response.status(400).send('error.db.error');
            }
            //TODO SEND MAIL
            return response.status(200).end();
          });
        },function() {
          response.status(400).send('error.db.error');
      });
    });
  },

  resetPassword: function(request, response){
    if( !request.body.password || !request.body.resetKey )
    {
      return response.status(400).send('error.input.invalid');
    }
    User.prototype.checkForgetPasswordKey(request.body.resetKey,function(err,cif) {
      if(err)
      {
        return response.status(400).send('error.input.invalid');
      }
      if(!cif)
      {
        return response.status(400).send('error.input.invalid');
      }
      User.prototype.findByCif( cif, function(err,userList)
      {
        if(userList.length < 1)
        {
          return response.status(400).send('error.db.error');
        }
        var promise = new Promise(
           function(resolve, reject) {
             User.prototype.removeForgetPasswordKey(userList[0].cif,function(err)
             {
               if(err)
               {
                 reject();
               }
               resolve();
               console.log("!");
             });
           });
        promise.then( function() {
          userList[0].password = User.prototype.encryptPassword(request.body.password);
          User.prototype.updateUserProfile(userList[0], function(err)
          {
            if(err)
            {
              response.status(400).send('error.db.error');
            }
            //TODO SEND MAIL
            return response.status(200).end();
          }),function() {
            response.status(400).send('error.db.error');
          }
        });
      });
    });
  },

  listInvitationByEmailAndCompany: function(request, response){
    if( !request.body.email && !request.body.companyId )
    {
      return response.status(400).send('error.input.invalid');
    }
    invitationUser.prototype.listByEmailAndCompany(request.body.email,request.body.companyId,function (err,invitationList)
    {
      if(err)
      {
        return response.status(400).send('error.input.invalid' + err.message);
      }
      return response.status(200).send(JSON.stringify(invitationList));
    });
  },

  inviteUserToCompany: function(request, response){
    if( !request.body.invitaion )
    {
      return response.status(400).send('error.input.invalid');
    }
    //TODO check parse error or not
    var invitaionDetail = JSON.parse(request.body.invitaion);
    invitationUser.prototype.inviteUserToCompany(invitaionDetail,function(err){
      if(err)
      {
        return response.status(400).send('error.input.invalid' + err.message);
      }
      return response.status(200).send();
    });
  },

  checkInviteKey: function(request, response){
    if( !request.body.inviteKey )
    {
      return response.status(400).send('error.input.invalid');
    }
    invitationUser.prototype.checkInviteKey(request.body.inviteKey ,function(err,invitaion){
      if(err)
      {
        return response.status(400).send('error.input.invalid' + err.message);
      }
      return response.status(200).send(JSON.stringify(invitaion));
    });
  },

  acceptUserInvite: function(request, response){
    if( !request.body.cif || !request.body.invitation )
    {
      return response.status(400).send('error.input.invalid');
    }
    invitationUser.prototype.acceptUserInvite(request.body.cif ,request.body.invitation,function(err)
    {
      if(err)
      {
        return response.status(400).send('error.input.invalid' + err.message);
      }
      return response.status(200).send();
    });
  },

  insertForgetPasswordKey: function(request, response){
    if( !request.body.cif || !request.body.resetKey )
    {
      return response.status(400).send('error.input.invalid');
    }
    User.prototype.insertForgetPasswordKey(request.body.cif ,request.body.resetKey,function(err)
    {
      if(err)
      {
        return response.status(400).send('error.input.invalid' + err.message);
      }
      return response.status(200).send();
    });
  },

  checkForgetPasswordKey: function(request, response){
    if( !request.body.resetKey  )
    {
      return response.status(400).send('error.input.invalid');
    }
    User.prototype.checkForgetPasswordKey(request.body.resetKey,function(err,returnCif)
    {
      if(err)
      {
        return response.status(400).send('error.input.invalid' + err.message);
      }
      return response.status(200).send(returnCif);
    });
  },

  removeForgetPasswordKey: function(request, response){
    if( !request.body.cif )
    {
      return response.status(400).send('error.input.invalid');
    }
    User.prototype.removeForgetPasswordKey(request.body.cif,function(err)
    {
      if(err)
      {
        return response.status(400).send('error.input.invalid' + err.message);
      }
      return response.status(200).send();
    });
  }


}
