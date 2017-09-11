var CheckResetPasswordDb    = require('./dbConnector/resetPasswordListDb');
var UserDb    = require('./dbConnector/userDb');
var Bcrypt = require('bcryptjs');

User.prototype.STATUS_ACTIVE = 1;
User.prototype.STATUS_CANCEL = 2;
User.prototype.STATUS_EXPIRED = 3;

function User() {
  var cif,email,password,firstname,lastname,timezoneCode,status;
}

User.prototype.createObjectFromDb = function( newUserDetail ) {
  var newUserObject = new User();
  newUserObject.cif = newUserDetail.CIF;
  newUserObject.email = newUserDetail.EMAIL;
  newUserObject.password = newUserDetail.PASSWORD;
  newUserObject.firstname = newUserDetail.FIRSTNAME;
  newUserObject.lastname = newUserDetail.LASTNAME;
  newUserObject.timezoneCode = newUserDetail.TIMEZONE_CODE;
  newUserObject.status = newUserDetail.STATUS;
  return newUserObject;
};


User.prototype.updateUserProfile = function( userObject,callback )
{
  UserDb.updateUserInformation(userObject,function(err)
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null,userObject);
  });
};

User.prototype.authenticate = function( userObject , plainText)
{
  return Bcrypt.compareSync(plainText, userObject.password );
};

User.prototype.encryptPassword = function(plainText)
{
  if (!plainText) return '';
  return Bcrypt.hashSync(plainText, 10);
};

User.prototype.findByEmail = function(email,callback)
{
  var result = [];
  UserDb.findByEmail( email , function( err , user) {
    if(err)
    {
      callback(err);
    }
    if(user.length == 0 )
    {
      return callback(null,[]);
    }
    user.forEach( function(userRow) {
      result.push( User.prototype.createObjectFromDb( userRow ));
  });
  return callback(null,result) });
};

User.prototype.findByCif = function(cif,callback)
{
  var result = [];
  UserDb.findByCif( cif , function( err , user) {
    if(err)
    {
      callback(err);
    }
    if(user.length == 0 )
    {
      return callback(null,[]);
    }
    user.forEach( function(userRow) {
      result.push( User.prototype.createObjectFromDb( userRow ));
  });
  return callback(null,result) });
};


User.prototype.insertForgetPasswordKey = function(cif,resetKey,callback)
{
  CheckResetPasswordDb.insertForgetPasswordKey( cif , resetKey, function( err ) {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
}

User.prototype.checkForgetPasswordKey = function( key,callback)
{
  CheckResetPasswordDb.getByForgetPasswordKey( key , function( err,resetObject ) {
    if(err)
    {
      return callback(err);
    }
    if(resetObject.length <1 )
    {
      return callback(null,null);
    }
    return callback(null,resetObject[0].CIF);
  });
}

User.prototype.removeForgetPasswordKey = function(cif,callback)
{
  CheckResetPasswordDb.removeForgetPasswordKey( cif , function( err ) {
  return callback(err);
  });
}

User.prototype.getUserListByCompanyId = function(companyId,callback)
{
  var result = [];
  UserDb.getUserListByCompanyId( companyId , function( err , user) {
    if(err)
    {
      return callback(err);
    }
    if(user.length == 0 )
    {
      return callback(null,[]);
    }
    user.forEach( function(userRow) {
      result.push( User.prototype.createObjectFromDb( userRow ));
  });
  return callback(null,result) });
};

User.prototype.cancelUser = function(user,callback)
{
  user.status = User.prototype.STATUS_CANCEL;
  UserDb.updateUserInformation( user , function( err ) {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};

module.exports = User;
