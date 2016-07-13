/**
 *  Mailing_listController
 *
 *  @description :: Server-side logic for managing Mailing_lists
 *  @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


 var def_host = 'us5.api.mailchimp.com';
 var def_port = 443;
 var def_authorization = "apikey "+sails.config.mailChimpApiKey;
 var def_list = 'd297c1caa1';


module.exports = {
	// ---
	// Mailchimp basic function.
	// ---
	mail_status: function(req, res) {
		//  ---
		//	Return details from mail-chimp lists
		//  ---
		sails.log.debug('APIKEY'+sails.config.mailChimpApiKey);
		var https = require('https');
		var hash = require('crypto');

		// sails.log.debug(req.param('id'));
		User.findOneById(req.param('id')).populateAll()
			.exec(function(err,user){
				// sails.log.debug(user.auth.email);
				mail_hash = hash.createHash('md5').update(user.auth.email).digest("hex");
				// sails.log.debug(mail_hash);
				var options = {
					host: def_host,
					port: def_port,
					path: '/3.0/lists/'+def_list+'/members/'+mail_hash+'/',
					headers: {
						'Authorization': def_authorization
					},
					method: 'GET'
				};
				// sails.log.debug(options);
				var reqGet = https.request(options, responseHandler(res)).end();
			});
	},


	subscribe: function(req, res) {
		//  ---
		//	Send the email to the mailing list
		//  ---
		var https = require('https');
		var hash = require('crypto');
		var mail_hash = hash.createHash('md5').update(req.param('email')).digest("hex");

		var requestData = JSON.stringify({
			"email_address": req.param('email'),
			"status_if_new":"subscribed"
		});

		// sails.log.debug(mail_hash);
		var options = {
			host: def_host,
			port: def_port,
			path: '/3.0/lists/'+def_list+'/members/'+mail_hash+'/',
			headers: {
				'Authorization': def_authorization
			},
			json: true,
			method: 'PUT'
		};
		// sails.log.debug(options);
		var reqGet = https.request(options, responseHandler(res)).end(requestData);
	}

};

function responseHandler(res) {
    return function(response) {
        // deal with response here
		var str = '';
		response.setEncoding('utf8');
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk.trim();
		});
		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			try {
				// response available as `responseData` in `yourview`
				res.locals.requestData = JSON.parse(str);
			} catch (e) {
				sails.log.warn('Could not parse response from options.hostname: ' + e);
			}
            sails.log.debug(res.locals.requestData)
            if (res.locals.requestData.status != 400)
			    res.json(JSON.parse(str));
            else {
                res.badRequest(JSON.parse(str));
            }
		});

		response.on('error', function(e) {
			sails.log.debug('--- API ERROR ---')
			sails.log.error(e);
			res.json(e);
		});
    }
};
