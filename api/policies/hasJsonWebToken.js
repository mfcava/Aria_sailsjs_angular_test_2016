'use strict';
/* jshint unused:false */

/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
module.exports = function(req, res, next) {
  // sails.log("hasJsonWbToken: "req.headers);
  waterlock.validator.validateTokenRequest(req, function(err, user){
    if(err){
      sails.log("hasJsonWbToken: req has not a Token");
      return res.forbidden(err);
    }
    sails.log("hasJsonWbToken: req has Token");
    // valid request
    next();
  });
};
