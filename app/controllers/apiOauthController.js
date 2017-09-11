var oauthModel = require('./../lib/oauthModel');

module.exports = {
  revokeRefreshToken: function(request, response){
    if(!request.body.refresh_token)
    {
      return response.status(400).send('error.input.invalid');
    }
    oauthModel.revokeRefreshToken(request.body.refresh_token , function(err)
    {
      //log for error
      if(err)
      {
        console.log(err);
        return response.status(400).send( err );
      }
      return response.status(200).send();
    });
  }
}
