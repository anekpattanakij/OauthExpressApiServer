var industry = require('./../model/industry');

module.exports = {
  listIndustry: function(request, response){
    industry.prototype.list( function( err,industryList )
    {
      if(err)
      {
        return response.status(400).send( err );
      }
      return response.status(200).send( JSON.stringify(industryList) );
    });
  }

}
