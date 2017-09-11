var masterIndustryDb    = require('./dbConnector/masterIndustryDb');

function Industry() {
  var industryCode;
}

Industry.prototype.createObjectFromDb = function( newIndustryDetail )
{
  var newIndustyObject = new Industry();
  newIndustyObject.industryCode = newIndustryDetail.INDUSTRY_CODE;
  return newIndustyObject;
}

Industry.prototype.list = function(callback) {
  var result = [];
    masterIndustryDb.listIndustryCode( function( err , industryList) {
      if(err)
      {
        console.log(err);
        return callback(err);
      }
      if(industryList.length == 0 )
      {
        return callback(null,result)
      }
      industryList.forEach( function(industryRow) {
        var returnIndustry = Industry.prototype.createObjectFromDb(industryRow);
        result.push(returnIndustry);
      });
      return callback(null,result);
    });
};

module.exports = Industry;
