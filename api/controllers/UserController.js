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

        var options = {
            host: 'us5.api.mailchimp.com',
            port: 443,
            path: '/3.0/lists/d297c1caa1/members/11b5323051f5fd65dc54894edfcc0c14/',
            headers: {
                'Authorization': 'apikey 3e16043a238414ad19b333a4a8f793d4-us5'
            },
            method: 'GET'
        };

        callback = function(response) {
            var str = '';
            response.setEncoding('utf8');
            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });
            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                    sails.log.debug('STATUS: ' + response.statusCode);
                    sails.log.debug('---');
                    sails.log.debug('HEADERS: ' + JSON.stringify(response.headers));
                    sails.log.debug('---');
                    sails.log.debug(str);
                    res.json(str);
                });
            response.on('error', function(e) {
                sails.log.debug('--- API ERROR ---')
                sails.log.error(e);
                res.json(e);
            });
        }

        var reqGet = https.request(options, callback).end();

    }

});
