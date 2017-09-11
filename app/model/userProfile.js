var User    = require('./user');
var Role    = require('./role');
var Company    = require('./company');
var Promise = require('promise');
var UserDb    = require('./dbConnector/userDb');

function UserProfile() {
  var user,role;
}

UserProfile.prototype.loadUserProfile = function( userProfileObject, callback )
{
  //load role list base on user object
  var promiseObject = new Promise(function(resolve, reject) {
    userProfileObject.role = [];
    Role.prototype.findByCif(userProfileObject.user.cif , function( err,roleList) {
      if(err)
      {
        reject(err);
      }
      userProfileObject.role = roleList;
      resolve();
    });
  });
  promiseObject.then(function(value) {
      //return sort company and success
      return callback(null);
    },
    function(reason) {
      console.log('Handle rejected promise ('+reason+') here.');
      response.render('error' );
      return callback(err);
  });
}

UserProfile.prototype.createNewUserProfile = function(userProfileObject, callback) {
  UserDb.saveUserProfile(userProfileObject, function (err) {
    return callback(err);
  });
}

UserProfile.prototype.createNewUserProfileFromInvitation = function(userProfileObject,invitation, callback) {
  UserDb.saveUserProfileToExistingCompany(userProfileObject,invitation, function (err) {
    return callback(err);
  });
}

UserProfile.prototype.addNewUserToCompany = function(callback) {
  /*UserDb.create({email: this._email, firstname:this._firstname, lastname:this._lastname, password: this._password}, function (err, user) {
    if(err)
    {
      console.log(err);
    }
    console.log('created account in DynamoDB', user.get('email'));
    return callback(err);
  });*/
}

module.exports = UserProfile;
