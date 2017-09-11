var CompanyDb    = require('./dbConnector/companyDb');
var InviteUserDb    = require('./dbConnector/inviteUserDb');

function Company() {
  var companyId,companyName,companyUrl,address1,address2,city,state,postalCode,country,industryCode;
}

Company.prototype.createObjectFromDb = function( newCompanyDetail )
{
  var newCompanyObject = new Company();
  newCompanyObject.companyId = newCompanyDetail.COMPANY_ID;
  newCompanyObject.companyName = newCompanyDetail.COMPANY_NAME;
  newCompanyObject.companyUrl = newCompanyDetail.COMPANY_URL;
  newCompanyObject.address1 = newCompanyDetail.ADDRESS1;
  newCompanyObject.address2 = newCompanyDetail.ADDRESS2;
  newCompanyObject.city = newCompanyDetail.CITY;
  newCompanyObject.state = newCompanyDetail.STATE;
  newCompanyObject.postalCode = newCompanyDetail.POSTAL_CODE;
  newCompanyObject.country = newCompanyDetail.COUNTRY_CODE;
  newCompanyObject.industryCode = newCompanyDetail.INDUSTRY_CODE;
  return newCompanyObject;
}

Company.prototype.findByCompanyId = function(companyId, callback) {
  var result = [];
  CompanyDb.findByCompanyId( companyId , function( err , companyList) {
    if(err)
    {
      return callback(err);
    }
    if(companyList.length == 0 )
    {
      return callback(null,null);
    }
    return callback(null,Company.prototype.createObjectFromDb(companyList[0]));
  });
};

Company.prototype.updateCompanyProfile = function( companyObject,callback )
{
  CompanyDb.updateCompanyInformation(companyObject,function(err)
  {
    if(err)
    {
      return callback(err);
    }
    return callback(null,companyObject);
  });
};


module.exports = Company;
