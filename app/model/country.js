var masterCountryDb    = require('./dbConnector/masterCountryDb');

function Country() {
  var countryCode;
}


Country.prototype.createObjectFromDb = function( newCountryDetail )
{
  var newCountryObject = new Country();
  newCountryObject.countryCode = newCountryDetail.COUNTRY_CODE;
  return newCountryObject;
}

Country.prototype.list = function(callback) {
  var result = [];

  masterCountryDb.listCountry( function( err , countryList) {
    if(err)
    {
      callback(err);
    }
    if(countryList.length == 0 )
    {
      return callback(null,result)
    }
    countryList.forEach( function(countryRow) {
      var returnCountry = Country.prototype.createObjectFromDb(countryRow);
      result.push(returnCountry);
    });
    return callback(null,result);
  });
};

module.exports = Country;
