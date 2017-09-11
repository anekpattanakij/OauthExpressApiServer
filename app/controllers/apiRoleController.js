var Role = require('./../model/role');

module.exports = {
  findByCif: function(request, response){
    if(!request.body.cif)
    {
      return response.status(400).send('error.input.invalid');
    }
    Role.prototype.findByCif( request.body.cif,function( err,roleList )
    {
      if(err)
      {
        return response.status(400).send( err );
      }
      return response.status(200).send( JSON.stringify(roleList) );
    });
  },

  list: function(request, response){
    Role.prototype.list( function( err,roleList )
    {
      if(err)
      {
        return response.status(400).send( err );
      }
      return response.status(200).send( JSON.stringify(roleList) );
    });
  },

  saveRoleByCif: function(request, response){
    if(!request.body.cif && !request.body.role)
    {
      return response.status(400).send('error.input.invalid');
    }
    var roleObject = JSON.parse(request.body.role);

    Role.prototype.save(cif,roleObject,function(err)
    {
      if(err)
      {
        return response.status(400).send( err );
      }
      return response.status(200).send();
    });
  }

}
