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

  waterlock.validator.validateTokenRequest(req, function(err, user){
    if(err) {
      return res.forbidden(err);
      }
    else {
         if ( req.headers['access_token'] === undefined ) {
            if ( req.headers['Authorization'] !== undefined )
               req.headers['access_token'] = req.headers['Authorization'];
            else
               return res.forbidden(err);
            }
            sails.log("ValidJsonWebToken: "+ req.headers['access_token'] );
		        Jwt.findOneByToken(req.headers['access_token']).exec(function(err, token) {
			         if (typeof token !== 'undefined') {
				          sails.log("ValidJsonWebToken: token valid");
	    		        // valid request
				          next();
			            }
               else {
				            sails.log("ValidJsonWebToken: token not found");
				            return res.forbidden(err);
		                }
		           });
            }
  });

};
