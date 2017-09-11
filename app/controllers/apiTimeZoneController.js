var timeZone = require('./../model/timeZone');

module.exports = {
  listTimeZone: function(request, response){
    timeZone.prototype.list( function( err,timeZoneList )
    {
      if(err)
      {
        return response.status(400).send( err );
      }
      return response.status(200).send( JSON.stringify(timeZoneList) );
    });
  }

}
