var RoleDb    = require('./dbConnector/roleDb');
var CompanyDb    = require('./dbConnector/companyDb');
var MasterRoleDb    = require('./dbConnector/masterRoleDb');
var Company    = require('./company');
var Promise    = require('bluebird');

const  ADMIN_ROLE_ID = 1;
const  MARKETING_ROLE_ID = 2;
const  MANAGEUSER_ROLE_ID = 3;
const  REPORT_ROLE_ID = 4;
const  CUSTOM_ROLE_ID = 5;

function Role() {
  var roleId,roleCustom,company,description;
}

Role.prototype.createObjectFromDb = function( newRoleDetail,callback )
{
  var newRoleObject = new Role();
  newRoleObject.roleId = newRoleDetail.ROLE_ID;
  newRoleObject.roleCustom = newRoleDetail.ROLE_CUSTOM;
  Company.prototype.findByCompanyId(newRoleDetail.COMPANY_ID,function(err,companyObject)
  {
    if(err)
    {
      return callback(err);
    }
    newRoleObject.company = companyObject;
    return callback(null,newRoleObject) ;
  });
}

Role.prototype.createObjectMasterFromDb = function( newRoleDetail,callback )
{
  var newRoleObject = new Role();
  newRoleObject.roleId = newRoleDetail.ROLE_ID;
  newRoleObject.description = newRoleDetail.ROLE_DESCRIPTION;
  return newRoleObject;
}


Role.prototype.findByCif = function(cif,callback) {
  var result = [];
  RoleDb.findByCif( cif , function( err , role) {
    if(err)
    {
      callback(err);
    }
    if(role.length == 0 )
    {
      return callback(null,result)
    }
    var promiseChain = [];

    role.forEach( function(roleRow) {
      promiseChain.push( new Promise(
         function(resolve, reject) {
           Role.prototype.createObjectFromDb( roleRow, function( err,Role )
           {
             result.push(Role);
             resolve();
           });
         }));
  });
  Promise.all(promiseChain).then( function()
  {
      return callback(null,result);
  })
 .catch( function(err)
  {
      return callback(err);
  });
  });
}

Role.prototype.list = function(callback) {
  var result = [];
    MasterRoleDb.listRoleCode( function( err , roleList) {
      if(err)
      {
        callback(err);
      }
      if(roleList.length == 0 )
      {
        return callback(null,result)
      }
      roleList.forEach( function(roleRow) {
        var returnRole = Role.prototype.createObjectMasterFromDb(roleRow);
        result.push(returnRole);
      });
      return callback(null,result);
    });
}

Role.prototype.save = function(cif,role,callback) {
  RoleDb.save(cif,role.company.companyId,role.roleId,role.roleCustom, function( err )
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
}


module.exports = Role;
