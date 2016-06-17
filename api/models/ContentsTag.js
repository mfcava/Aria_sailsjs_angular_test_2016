/**
 * ContentsTag.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: 'string',
    posts: {
      collection: 'post',
      via: 'tags'
      }
  },

  // Lifecycle Callbacks
  beforeCreate: function (values, cb) {
  //  Lower Case tag Name
      values.name = values.name.toLowerCase();
      // calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    }

};
