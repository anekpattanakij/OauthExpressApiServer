var country = require('./../model/country');

module.exports = {
  listCountry: function(request, response){
    country.prototype.list( function( err,countryList )
    {
      if(err)
      {
        return response.status(400).send( err );
      }
      return response.status(200).send( JSON.stringify(countryList) );
    });
  },

  findByCountryCode: function(request, response){
    /*if( !request.body.newDomain)
    {
      return response.status(400).send('error.input.invalid');
    }*/
    return response.status(200).end();
  }

}
