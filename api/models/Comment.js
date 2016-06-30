/**
 * Comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        text: 'string',
        parent: 'string',
        owned: {
	        model: 'user'
        },
        post_owner: {
            model: 'post'
        }
    },

    // Lifecycle Callbacks
    // afterDestroy - Delete all related (child) comments.
    afterDestroy: function(destroyedRecord, cb) {
        Comment.find({parent: destroyedRecord[0].id}).exec(function(err, comments) {
            if ( comments.length > 0 ) {
                for (i = 0; comments.length > i; i += 1) {
                    var deletedCommentId = comments[i].id;
                    // As a comment is destroyed this callback is fired again.
                    // so there is no need to nest a procedure to parse all the
                    // comments tree.
                    Comment.destroy({id: deletedCommentId}).exec(function(err) {
                        if (err) sails.log(err);
                    });
                }
            }
        });
        // Callback to exit from the event.
        cb();
    }

};
