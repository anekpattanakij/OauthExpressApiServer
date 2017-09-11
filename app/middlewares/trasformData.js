module.exports = function(req, res, next) {
  //console.log(req.user);
   req.user = JSON.parse(req.user);
   next();
};
