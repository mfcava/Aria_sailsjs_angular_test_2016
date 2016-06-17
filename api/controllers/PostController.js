/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  findTagByName: function  (req, res) {
  //  ---
	//	Return a list of Tags based on a search query
	//  ---
	    if (req.method !== 'GET')
				 return res.json({'status':'Method not allowed'});
			   //  ---
				 //	Call not via GET is error
			   //  ---
			var name = req.param('name');
      // Find any Tag with a name LIKE %name%
			ContentsTag.findByNameLike('%'+name+'%')
         .exec(function(err,tags){
             if (err)
            		res.json({error:err});
          	 if (tags === undefined)
            		res.notFound();
          	 else
             		res.json(tags);
				 });
	},

	findPostByTagName: function  (req, res) {
  //  ---
	//	Return a list of Posts based on a lists of name
	//  ---
			if(req.method !== 'GET')
				return res.json({'status':'Method not allowed'});
			  //  ---
				//	Call not via GET is error
			  //  ---
			var name = req.param('name');
			var names = name.split(",");
        // Find any POST in the database and select only ID and TITLE FIELDS and,
        // for each one, also .POPULATE their TAGS association then
        // select only recods with {name} equal to names.
		    Post.find( {select: ['id','title']} ).populate('tags', {name: names, select: ['id','name'] }  )
				.exec(function(err,tags){
          			if(err)
            			res.json({error:err});
          		    if(tags === undefined)
            			res.notFound();
          		    else
             		   	res.json(tags);
				});
	},

  show: function  (req, res) {
  //  ---
  //	Return a post based on Slug_title and not the ID
  //  ---
  if(req.method !== 'GET')
    return res.json({'Status':'Method not allowed'});
    //  ---
    //	Call not via GET is error
    //  ---
  console.log("PostController.js show: "+req.param('title_slug'));
  Post.findOneByTitle_slug(req.param('title_slug')).populateAll()
    .exec(function(err,post){
          if(err)
            res.json({error:err});
          if (post === undefined)
             res.notFound();
          else
             res.json(post);
          });
  }
};
