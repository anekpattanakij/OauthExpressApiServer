var User = require('./../model/user');
var UserProfile = require('./../model/userProfile');
var Role    = require('./../model/role');
var Company    = require('./../model/company');

module.exports = {

  authenticateWithPassword: function(request, response){
    if( !request.body.username|| !request.body.password )
    {
      return response.status(400).send('error.input.invalid');
    }
    var username = request.body.username;
    var password = request.body.password;
    User.prototype.findByEmail( username, function(err,userList)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      if(userList.length < 1)
      {
        return response.status(400).send('error.authenticate.wrongUserOrPassword');
      }
      var returnUser = userList[0];
      if(!User.prototype.authenticate(returnUser,password))
      {
        return response.status(400).send('error.authenticate.wrongUserOrPassword');
      }
      var returnUserProfile = new UserProfile();
      returnUserProfile.user = returnUser;
      UserProfile.prototype.loadUserProfile(returnUserProfile, function(err)
      {
        if(err)
        {
          return response.status(400).send('error.db.error');
        }
        return response.status(200).send(JSON.stringify(returnUserProfile));
      });
    });
  },

  createNewUserProfile: function(request, response){
    if( !request.body.userProfileObject )
    {
      return response.status(400).send('error.input.invalid');
    }
    var loadProfileObject = JSON.parse(request.body.userProfileObject);
    UserProfile.prototype.createNewUserProfile(loadProfileObject, function(err)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      return response.status(200).end();
    });
  },

  createNewUserProfileFromInvitation: function(request, response){
    if( !request.body.userProfileObject && request.body.invitation )
    {
      return response.status(400).send('error.input.invalid');
    }
    var loadProfileObject = JSON.parse(request.body.userProfileObject);
    var loadInvitationObject = JSON.parse(request.body.invitation);
    UserProfile.prototype.createNewUserProfileFromInvitation(loadProfileObject,loadInvitationObject, function(err)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      return response.status(200).end();
    });
  },

  addNewUserProfileToCompany: function(request, response){
    //UserProfile.prototype.addNewUserToCompany = function(callback) {
    return response.status(400).send('error.db.error');
  }

}
