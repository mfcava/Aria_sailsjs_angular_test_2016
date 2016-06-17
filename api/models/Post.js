/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

   attributes: {
  	  title: 		  'string',
      title_slug: {
        type: 'string',
        unique: true
        },
  	  content: 		'string',
  	  coverImage: 'string',
      layoutClass: 'string',
  	  owned: {
  		  model: 'user'
  	    },
      metatags: {
          model: 'metatag',
          unique: true
          },
      tags: {
        collection: 'ContentsTag',
        via: 'posts',
        dominant: true // ---
      }
   },

   beforeCreate: function (values, cb) {
     sails.log("Post.js: "+values.title);
     if (values.title === '') {
        var err = {
            code: 'E_UNIQUE',
            details: 'Invalid Post Title',
            model: 'Post',
            invalidAttributes: {
               title: [
                 {
                   "rule": "string",
                   "message": "Title is null"
                 }],
                },
            status: 400
            }
        return cb(err);
        }
     var Text = String(values.title);
     values.title_slug = Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
     // values.title_slug = values.title
     // console.log(values.title_slug);
     cb();
   },

   beforeUpdate: function (values, cb) {
     sails.log("Post.js - Update: "+values.title);
     if (values.title === '') {
        var err = {
            code: 'E_UNIQUE',
            details: 'Invalid Post Title',
            model: 'Post',
            invalidAttributes: {
               title: [
                 {
                   "rule": "string",
                   "message": "Title is null"
                 }],
                },
            status: 400
            }
        return cb(err);
        }
     var Text = String(values.title);
     values.title_slug = Text
          .toLowerCase()
          .replace(/[^\w ]+/g,'')
          .replace(/ +/g,'-')
     // values.title_slug = values.title
     // console.log(values.title_slug);
     cb();
   },

};
