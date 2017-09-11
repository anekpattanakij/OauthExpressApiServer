var domainDb    = require('./dbConnector/domainDb');

Domain.prototype.STATUS_ACTIVE = 'A';
Domain.prototype.STATUS_INACTIVE = 'I';

function Domain() {
  var domainName,status;
}

Domain.prototype.createObjectFromDb = function( newDomainDetail )
{
  var newDomainObject = new Domain();
  newDomainObject.domainName = newDomainDetail.DOMAIN_NAME;
  newDomainObject.status = newDomainDetail.DOMAIN_STATUS;
  return newDomainObject;
};

Domain.prototype.listByCompanyId = function(companyId,callback) {
  var result = [];
  domainDb.listByCompanyId( companyId,function( err , domainList) {
    if(err)
    {
      return callback(err);
    }
    if(domainList.length == 0 )
    {
      return callback(null,result)
    }
    domainList.forEach( function(domainRow) {
      var returnDomain = Domain.prototype.createObjectFromDb(domainRow);
      result.push(returnDomain);
    });
    return callback(null,result);
  });
};

Domain.prototype.listByDomainName = function(domainName,callback) {
  var result = [];
  domainDb.listByDomainName( domainName,function( err , domainList) {
    if(err)
    {
      return callback(err);
    }
    if(domainList.length == 0 )
    {
      return callback(null,result)
    }
    domainList.forEach( function(domainRow) {
      var returnDomain = Domain.prototype.createObjectFromDb(domainRow);
      result.push(returnDomain);
    });
    return callback(null,result);
  });
};

Domain.prototype.addDomainToCompany = function(companyId,domainObject,callback) {
  domainDb.save(companyId,domainObject, function( err )
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};

Domain.prototype.updateDomainStatus = function(companyId,domainObject,callback) {
  domainDb.update(companyId,domainObject, function( err )
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};

Domain.prototype.removeCompanyDomain = function(companyId,domainName,callback) {
  domainDb.delete(companyId,domainName, function( err )
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};


module.exports = Domain;
