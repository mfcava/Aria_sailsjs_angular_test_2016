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
    if(err){
      return res.forbidden(err);
    }

    Jwt.findOneByToken(req.headers.access_token).exec(function(err, token) {
		if (typeof token !== 'undefined') {
			 if ( req.body.owned != token.owner ) {
			  	sails.log("isPostOwner: not my owner");
				  return res.forbidden(err);
			    }
		   }
    else {
			   sails.log("isPostOwner: owner undefined");
			   sails.log(req.headers.access_token +' === '+ req.body.owner.id+' === '+ token)
			   return res.forbidden(err);
		     }
		sails.log("isPostOwner: ok edit")
	  next();
		});
  });
};
