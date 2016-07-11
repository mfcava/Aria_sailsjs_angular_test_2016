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
        if (err) {
            return res.forbidden(err);
        }
        sails.log(req.body);
        sails.log(req.query);

        Jwt.findOneByToken(req.headers.access_token).exec(function(err, token) {
		    if (typeof token !== 'undefined') {
			    if ( req.body.owned === 'undefined' || req.body.owned === '' )
                    sails.log("hasUser: Add currentUser to Request");
                req.body.owned = token.owner;
		    }
            else {
			   sails.log("hasUser: User not LoggedIN");
			   sails.log(req.headers.access_token +' === '+ req.body.owner.id+' === '+ token)
			   return res.forbidden(err);
		    }
		    sails.log("hasUser: OK")
	        next();
		});
    });
    
};
