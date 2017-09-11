var domain = require('./../model/domain');
var DomainDetail = require('./../model/domainDetail');
var emailUtil = require('./../lib/emailUtil');

module.exports = {

  listDomainByCompanyId: function(request, response){
    if( !request.body.companyId)
    {
      return response.status(400).send('error.input.invalid');
    }
    domain.prototype.listByCompanyId( request.body.companyId, function(err,domainList)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      //TODO Get update status from mailgun
      return response.status(200).end(JSON.stringify(domainList));
    });
  },

  addDomainToCompany: function(request, response){
    if( !request.body.companyId || !request.body.domainObject)
    {
      return response.status(400).send('error.input.invalid');
    }
    //check duplicate // not allow use domain duplucate between companyId
    var domainObject = JSON.parse(request.body.domainObject);
    domain.prototype.listByDomainName( domainObject.domainName, function(err,domainList)
    {

      if(err)
      {
        console.log(err);
        return response.status(400).send('error.db.error');
      }
      domainList.forEach( function(domainRow) {
        if(domainObject.domainName == domainRow.domainName)
        {
          return response.status(400).send('error.addDomainToCompany.domain.duplicate');
        }
      });
      emailUtil.saveNewDomain(domainObject.domainName,function(err,returnDomainDetail)
      {
        //check error that duplaicate with other on mailgun service or not.
        if(err)
        {
          console.log(err);
          return response.status(400).send('error.addDomainToCompany.domain.duplicate');
        }
        //Add domain to company first
        domain.prototype.addDomainToCompany( request.body.companyId,domainObject, function(err,domainList)
        {
          if(err)
          {
            console.log(err);
            return response.status(400).send('error.db.error');
          }
          // Add domain detail
          returnDomainDetail.sending_dns_records.forEach( function(domainDetailRow) {
            var domainDetailObject = new DomainDetail();
            domainDetailObject.recordName = domainDetailRow.name;
            domainDetailObject.recordType = domainDetailRow.record_type;
            if(DomainDetail.prototype.MAILGUN_VALID_STATUS  == domainDetailRow.valid)
            {
              domainDetailObject.recordStatus = DomainDetail.prototype.STATUS_VALID ;
            } else {
              domainDetailObject.recordStatus = DomainDetail.prototype.STATUS_INVALID ;
            }
            domainDetailObject.value = domainDetailRow.value;
            DomainDetail.prototype.addDomainDetailToDomain(domainObject.domainName,domainDetailObject,function(err)
            {
              if(err)
              {
                console.log(err);
              }
            });
          });
          return response.status(200).end();
        });
      });
    });
  },

  removeCompanyDomain: function(request, response){
    if( !request.body.companyId || !request.body.domainName)
    {
      return response.status(400).send('error.input.invalid');
    }
    var domainName = request.body.domainName;
    //remove on service provider server first.
    emailUtil.removeDomain(domainName,function(err)
    {
      if(err)
      {
        return response.status(400).send('error.service.error');
      }
      domain.prototype.removeCompanyDomain( request.body.companyId,domainName, function(err,domainList)
      {
        if(err)
        {
          return response.status(400).send('error.db.error');
        }
        return response.status(200).end();
      });
    });
  },

  updateDomainStatus: function(request, response){
    if( !request.body.companyId || !request.body.domainObject)
    {
      return response.status(400).send('error.input.invalid');
    }
    var domainObject = JSON.parse(request.body.domainObject);
    domain.prototype.updateDomainStatus( request.body.companyId,domainObject, function(err,domainList)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      return response.status(200).end();
    });
  },

  refreshDomainStatus: function(request, response){
    if( !request.body.companyId || !request.body.domainName)
    {
      return response.status(400).send('error.input.invalid');
    }
    var domainName = request.body.domainName;
    emailUtil.getDomainStatus(domainName,function(err,returnDomainDetail)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      // Add domain detail
      returnDomainDetail.sending_dns_records.forEach( function(domainDetailRow) {
        var domainDetailObject = new DomainDetail();
        domainDetailObject.recordName = domainDetailRow.name;
        domainDetailObject.recordType = domainDetailRow.record_type;
        if(DomainDetail.prototype.MAILGUN_VALID_STATUS  == domainDetailRow.valid)
        {
          domainDetailObject.recordStatus = DomainDetail.prototype.STATUS_VALID ;
        } else {
          domainDetailObject.recordStatus = DomainDetail.prototype.STATUS_INVALID ;
        }
        domainDetailObject.value = domainDetailRow.value;
        DomainDetail.prototype.updateDomainDetailStatus(domainName,domainDetailObject,function(err)
        {
          if(err)
          {
            console.log(err);
          }
        });
      });
      return response.status(200).end();
    });
  },

  getCompanyDomainDetail: function(request, response){
    if( !request.body.companyId || !request.body.domainName)
    {
      return response.status(400).send('error.input.invalid');
    }
    DomainDetail.prototype.listByDomainName(request.body.domainName,function(err,returnDomainDetailList)
    {
      if(err)
      {
        return response.status(400).send('error.db.error');
      }
      return response.status(200).end(JSON.stringify(returnDomainDetailList));
    });
  }

}
