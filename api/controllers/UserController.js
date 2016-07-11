/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').actions.user({
    /*  e.g.
        action: function(req, res){

        }
    */

    mail: function(req, res) {
        //  ---
        //	Return details from mail-chimp lists
        //  ---
        var https = require('https');
        var hash = require('crypto');

        sails.log.debug(req.param('id'));
        User.findOneById(req.param('id')).populateAll()
            .exec(function(err,user){
                // sails.log.debug(user.auth.email);
                mail_hash = hash.createHash('md5').update(user.auth.email).digest("hex");
                // sails.log.debug(mail_hash);

                var options = {
                    host: 'us5.api.mailchimp.com',
                    port: 443,
                    path: '/3.0/lists/d297c1caa1/members/'+mail_hash+'/',
                    headers: {
                        'Authorization': 'apikey 33c1bfe4160e61637f575a985ae513c2-us5'
                    },
                    method: 'GET'
                };

                callback = function(response) {
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
                        res.json(JSON.parse(str));
                    });
                    response.on('error', function(e) {
                        sails.log.debug('--- API ERROR ---')
                        sails.log.error(e);
                        res.json(e);
                    });
                }

                var reqGet = https.request(options, callback).end();

            });

        // sails.log.debug(user);


    }

});
