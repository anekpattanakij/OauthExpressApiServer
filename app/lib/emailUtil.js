var mailgun = require('mailgun-js');
var config = require('config');

module.exports = {
  getMailConnection: function () {
    return mailgun({apiKey: config.get("MAILGUN_API_KEY")});
  },

  getDomainStatus: function (domainTarget,callback) {
    var connection = this.getMailConnection();
    connection.get("/domains/" + domainTarget,{event: []}, function (error, body) {
     if(error)
     {
       console.log(error);
       return callback(error);
     }
     return callback(null,body);
   });
 },

  saveNewDomain: function (domainName,callback) {
    var connection = this.getMailConnection();
    connection.post("/domains",{name:domainName}, function (error, body) {
     if(error)
     {
       console.log(error);
       return callback(error);
     }
     return callback(null,body);
   });
 },

  removeDomain: function (domainName,callback) {
    var connection = this.getMailConnection();
    connection.delete("/domains/"+ domainName,{event: []}, function (error, body) {
     if(error)
     {
       console.log(error);
       return callback(error);
     }
     return callback(null,body);
   });
  }


}
