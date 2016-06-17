/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

			
module.exports = {
	upload: function  (req, res) {
			if(req.method === 'GET')
				return res.json({'status':'GET not allowed'});						
				//	Call to /upload via GET is error
			req.file('file').upload({ dirname: '../../assets/images/upload/' }, function (err, uploadedFiles){
			  if (err) return res.send(500, err);
			  return res.send(200, uploadedFiles);
			});

	},
	showImage: function  (req, res, next) {
			var image = require('fs');
			if(req.method !== 'GET')
				return res.json({'status':'Only GET is allowed'});						
			var path = sails.config.appPath+'/assets/images/upload/'+req.param('filename');
			sails.log.debug(path);
			image.exists(path, function(exists) {
				if (exists) {
					if(typeof req.param('size') != 'undefined') {
						var size=0;
						sails.log.debug('resizing');
						switch ( req.param('size') ) {
							case 'small':
								sails.log.debug('resize: small');
								size=25;
								break;
							case 'medium':
								sails.log.debug('resize: medium');
								size=50;
								break;
							case 'large':
								size=75;
								break;
							default:
								image.createReadStream(path).pipe(res);
						};
						var gm = require('gm'); 
						var imageMagick = gm.subClass({ imageMagick: true });
						imageMagick(path).resize(size,size, "%")
							.stream(function streamOut (err, stdout, stderr) {
							 	if (err) return next(err);
							    	stdout.pipe(res); //pipe to response
							        stdout.on('error', next);
								});
					} else {
						sails.log.debug('no resizing');
						image.createReadStream(path).pipe(res);
					};
				} else {
					sails.log.debug('image is 404');
					image.createReadStream(sails.config.appPath+'/assets/images/logo.png').pipe(res);
					}		
			});

	}
	
};

