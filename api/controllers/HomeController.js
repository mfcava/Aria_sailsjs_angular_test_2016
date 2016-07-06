/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	* `HomeController.show()`
	*/
	show: function (req, res) {
		if(req.method !== 'GET')
			return res.json({'status':'Only GET is allowed'});
		sails.log.debug('HomeController.js: -----');
		var fs = require("fs");
		var fileName = sails.config.appPath+"/assets/styles/importer.css";
		sails.log.debug('check for file: '+fileName);
		fs.exists(fileName, function(exists) {
			sails.log.debug('---');
			if (exists) {
				sails.log.debug('exist');
				fs.readFile(fileName, "utf8", function(error, data) {
					sails.log.debug(data);
				});
			}
		});
		sails.log.debug('end check for file');
		return res.send(200, 'ok');
	}

};
