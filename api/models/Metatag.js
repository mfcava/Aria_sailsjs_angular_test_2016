/**
 * Metatag.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        title: {
            type:  'string',
            unique: true
        },
        description: 'string',
        owned: {
            model: 'Post'
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
