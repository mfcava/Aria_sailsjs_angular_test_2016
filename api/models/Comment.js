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
    afterDestroy: function(destroyedRecord, cb) {
        sails.log(destroyedRecord);
        Comment.find({parent: destroyedRecord[0].id}).exec(function(err, comments) {
            if ( comments.length > 0 ) {
                for (i = 0; comments.length > i; i += 1) {
                    var deletedCommentId = comments[i].id;
                    Comment.destroy({id: deletedCommentId}).exec(function(err) {
                        if (err) sails.log(err);
                        sails.log('childComments deleted:'+ deletedCommentId);
                    });
                // deleteChildComments(destroyedRecord[0].id);
                }
            }
        });
        // Callback to exit from the event.
        cb();
    }

};

function deleteChildComments(commentId) {
    sails.log('deleteChildComments: '+commentId);
    if (commentId != null) {
        sails.log('deleteChildComments: commentId not null');
        Comment.find({parent: commentId}).exec(function(err, comments) {
            sails.log('with parent: '+comments.length);
            if ( comments.length > 0 ) {
                for (i = 0; comments.length > i; i += 1) {
                    sails.log('deleteChildComments: deleted:'+commentId);
                    var deletedCommentId = comments[i].id;
                    Comment.destroy({id: deletedCommentId}).exec(function(err) {
                        if (err) {
                            sails.log(err);
                        }
                        sails.log('childComments deleted:'+ deletedCommentId);
                    });
                    sails.log('Comment.js - recursive call deleteChildComments for Id: '+comments[i].id);
                    deleteChildComments(deletedCommentId);
                }
            }
        });
    }
}
