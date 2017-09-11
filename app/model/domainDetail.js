var domainDetailDb    = require('./dbConnector/domainDetailDb');

DomainDetail.prototype.STATUS_VALID = 1;
DomainDetail.prototype.STATUS_INVALID = 2;
DomainDetail.prototype.MAILGUN_VALID_STATUS = 'valid';

function DomainDetail() {
  var recordName,recordType,recordStatus,value;
}

DomainDetail.prototype.createObjectFromDb = function( newDomainDetail )
{
  var newDomainDetailObject = new DomainDetail();
  newDomainDetailObject.recordName = newDomainDetail.DOMAIN_NAME;
  newDomainDetailObject.recordType = newDomainDetail.RECORD_TYPE;
  newDomainDetailObject.recordStatus = newDomainDetail.RECORD_STATUS;
  newDomainDetailObject.value = newDomainDetail.VALUE;
  return newDomainDetailObject;
};

DomainDetail.prototype.listByDomainName = function(domainName,callback) {
  var result = [];
  domainDetailDb.listByDomainName( domainName,function( err , domainDetailList) {
    if(err)
    {
      return callback(err);
    }
    if(domainDetailList.length == 0 )
    {
      return callback(null,result)
    }
    domainDetailList.forEach( function(domainDetailRow) {
      var returnDomainDetail = DomainDetail.prototype.createObjectFromDb(domainDetailRow);
      result.push(returnDomainDetail);
    });
    return callback(null,result);
  });
};

DomainDetail.prototype.addDomainDetailToDomain = function(domainName,domainDetailObject,callback) {
  domainDetailDb.save(domainName,domainDetailObject, function( err )
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};

DomainDetail.prototype.updateDomainDetailStatus = function(domainName,domainDetailObject,callback) {
  domainDetailDb.update(domainName,domainDetailObject, function( err )
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};

DomainDetail.prototype.removeDomainDetail = function(domainName,callback) {
  domainDetailDb.delete(companyId,domainName, function( err )
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null);
  });
};

module.exports = DomainDetail;
