var transfromDataMiddleware = require('../app/middlewares/trasformData');
var apiUserController = require('../app/controllers/apiUserController');
var apiUserProfileController = require('../app/controllers/apiUserProfileController');
var apiCompanyController = require('../app/controllers/apiCompanyController');
var apiDomainController = require('../app/controllers/apiDomainController');
var apiCountryController = require('../app/controllers/apiCountryController');
var apiIndustryController = require('../app/controllers/apiIndustryController');
var apiTimeZoneController = require('../app/controllers/apiTimeZoneController');
var apiRoleController = require('../app/controllers/apiRoleController');
var apiOauthController = require('../app/controllers/apiOauthController');

module.exports = function (app) {
  // user routes

  app.get('/error', function(req, res){
    res.render('error');
  });

  app.post('/revokeRefreshToken',apiOauthController.revokeRefreshToken );

  app.post('/forgetPassword', apiUserController.forgetPassword);

  app.post('/resetPassword', apiUserController.resetPassword);

  app.post('/inviteUserToCompany', apiUserController.inviteUserToCompany);

  app.post('/checkInviteKey', apiUserController.checkInviteKey);

  app.post('/listInvitationByEmailAndCompany', apiUserController.listInvitationByEmailAndCompany);

  app.post('/acceptUserInvite', apiUserController.acceptUserInvite);

  app.post('/findUserByEmail', app.oauth.authorise(), apiUserController.findUserByEmail);

  app.post('/cancelUser', app.oauth.authorise() , transfromDataMiddleware, apiUserController.cancelUser);

  app.post('/getUserListByCompanyId', app.oauth.authorise() , transfromDataMiddleware, apiUserController.getUserListByCompanyId);

  app.post('/authenticateWithPassword', apiUserProfileController.authenticateWithPassword);

  app.post('/createNewUserProfile', apiUserProfileController.createNewUserProfile);

  app.post('/createNewUserProfileFromInvitation', app.oauth.authorise() , transfromDataMiddleware, apiUserProfileController.createNewUserProfileFromInvitation);

  app.post('/updateUserProfile', app.oauth.authorise() , transfromDataMiddleware , apiUserController.updateUserProfile );

  app.post('/changePassword', app.oauth.authorise() , transfromDataMiddleware,apiUserController.changePassword );

  app.post('/updateCompanyProfile',app.oauth.authorise() , transfromDataMiddleware,apiCompanyController.updateCompanyProfile );

  app.all('/addUserToCompany',app.oauth.authorise() , transfromDataMiddleware,apiCompanyController.addUserToCompany );

  app.all('/findByCompanyId',app.oauth.authorise() , transfromDataMiddleware,apiCompanyController.findByCompanyId );

  //app.put('/registerInivteNewUserToCompany' ,apiCompanyController.registerInivteNewUserToCompany );
  
  app.post('/removeForgetPasswordKey', app.oauth.authorise() , transfromDataMiddleware,apiUserController.removeForgetPasswordKey );

}
