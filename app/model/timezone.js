var masterTimezoneDb    = require('./dbConnector/masterTimezoneDb');

function Timezone() {
  var timezoneCode,timezoneValue;
}

Timezone.prototype.createObjectFromDb = function(newTimezoneDetail )
{
  var newTimezoneObject = new Timezone();
  newTimezoneObject.timezoneCode = newTimezoneDetail.TIMEZONE_CODE;
  newTimezoneObject.timezoneValue = newTimezoneDetail.TIMEZONE_VALUE;
  return newTimezoneObject;
}

Timezone.prototype.list = function(callback) {

  var result = [];
  masterTimezoneDb.listTimezone( function( err , timezoneList) {
    if(err)
    {
      console.log(err);
      return callback(err);
    }
    if(timezoneList.length == 0 )
    {
      return callback(null,result)
    }
    timezoneList.forEach( function(timezoneRow) {
      var returnTimezone = Timezone.prototype.createObjectFromDb(timezoneRow);
      result.push(returnTimezone);
    });
    return callback(null,result);
  });
};

module.exports = Timezone;
