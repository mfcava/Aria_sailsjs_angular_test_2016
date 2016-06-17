// ---- ------------------------------------------------------------------- ---
// ----                                                                     ---
// ---- Init Controllers                                                    ---
// ----                                                                     ---
// ---- ------------------------------------------------------------------- ---
var AriaControllers = angular.module('AriaControllers', ['flow']);





AriaControllers.controller('AriaCtrl', ['$scope', 'Post', function($scope, Post ) {
    console.log('Controller.js - Root Controller');
    $scope.$emit('newPageLoaded', {
        'title': 'Millenials Marketing',
        'description': 'Marketing for millenials brand',
		'keywords': 'Marketing, Millenials, Brands',
    });
    $scope.hometag = 'marketing';

    $scope.postPreviewLimit = 350;
    $scope.sortBy = 'createdAt DESC';
    $scope.latestPost = Post.query({skip: 0 ,limit: 4, sort: $scope.sortBy } );


} ]);


















// ---- ------------------------------------------------------------------- ---
// ----                                                                     ---
// ---- User Controller                                                     ---
// ----                                                                     ---
// ---- ------------------------------------------------------------------- ---

AriaControllers.controller('UsersCtrl', ['$scope', 'User', function($scope, User) {
  $scope.users = User.query();
}]);

AriaControllers.controller('UserShowCtrl', ['$scope', '$routeParams', 'User', function($scope, $routeParams, User) {
  $scope.user = User.get({UserId: $routeParams.UserId});
}]);


























// ---- ------------------------------------------------------------------- ---
// ----                                                                     ---
// ---- Post Controller                                                     ---
// ----                                                                     ---
// ---- ------------------------------------------------------------------- ---

    // ---- ------------------------------------------------------------------- ---
    // ---- /post/ Controller                                                   ---
    // ---- ------------------------------------------------------------------- ---
    AriaControllers.controller('PostsCtrl', ['$scope', 'Post', function($scope, Post) {
        $scope.postPreviewLimit = 350;
        $scope.currentPage = 0;
        $scope.elementInPage = 3;
        $scope.sortBy = 'createdAt DESC';
        $scope.pageNumber = Math.ceil((Post.query.length) / $scope.elementInPage);
        $scope.latestPost = Post.query({skip: 0 ,limit: 1, sort: $scope.sortBy } );
        $scope.posts = Post.query({skip: $scope.currentPage*$scope.elementInPage+1 ,limit: $scope.elementInPage, sort: $scope.sortBy } );

        $scope.changeImageName = function (message) {
		        var f = jQuery.parseJSON(message.substr(message.indexOf("[")+1,message.lastIndexOf("]")-1));
	            $scope.post.coverImage = f.fd.split("/").pop() //prevent file from uploading
		        flash.setMessage("Uploaded: "+ $scope.post.coverImage);
		        currentMessage = queue.shift() || "";
        };

        $scope.setPage = function (pageNumber) {
	            if (pageNumber !== undefined) {
		                if (pageNumber == 'next') {
                            $scope.currentPage = $scope.currentPage+1; }
                        else if ( pageNumber == 'prev' && $scope.currentPage > 0)  {
                            $scope.currentPage = $scope.currentPage-1; }
                        else if ( pageNumber == 'prev' && $scope.currentPage == 0)  {
                            $scope.currentPage = 0; }
                        else {
		                    $scope.currentPage = pageNumber;
		                }
	            }
                else {
	                   $scope.currentPage = $scope.currentPage + 1;
	            }
	            $scope.posts = Post.query({skip: $scope.currentPage*$scope.elementInPage+1,limit: $scope.elementInPage, sort: $scope.sortBy } );
        };

        $scope.getPostsNumber = function(pageNumber){
            return new Array(pageNumber);
        };

        $scope.MailSubscribe = function () {
        };

}]);

    // ---- ------------------------------------------------------------------- ---
    // ---- /post/:id Controller                                                ---
    // ---- ------------------------------------------------------------------- ---
    AriaControllers.controller('PostShowCtrl', ['$scope', '$rootScope', '$routeParams', 'Post', 'Article', 'flash', function($scope, $rootScope, $routeParams, Post, Article, flash) {
        $scope.flash = flash;
        $scope.currentUser = $rootScope.currentUser;
        $scope.post;

        // console.log('Controller.js - PostShowCtrl currentUser:'+$rootScope.currentUser);
        if ( $routeParams.TitleSlug ) {
            console.log('Controller.js - TitleSlug: '+$routeParams.TitleSlug);
            Article.get({TitleSlug: $routeParams.TitleSlug})
            .$promise.then( function(val) {
                $scope.SetPostAndMeta(val);
            });
        }
        else {
            console.log('Controller.js - PostId: '+$routeParams.PostId);
            Post.get({PostId: $routeParams.PostId})
            .$promise.then( function(val) {
                $scope.SetPostAndMeta(val);
            });
        }

        $scope.deletePost = function (PostId) {
            Post.delete({ id: PostId });
            $scope.post = Post.query();
        };

        $scope.SetPostAndMeta = function (Post) {
            $scope.post = Post;
            var tags = '';
            // Set meta-data
            angular.forEach($scope.post.tags, function(value) {
                tags = tags + value.name + ",";
            });
            $scope.$emit('newPageLoaded', {
                'title': $scope.post.metatags.title,
                'description': $scope.post.metatags.description,
                'keywords': tags,
                'canonical': '#!/article/'+$scope.post.title_slug
            });
            // console.log(val.owned.id);
        };

    }]);

    // ---- ------------------------------------------------------------------- ---
    // ---- /post/:id/edit Controller                                           ---
    // ---- ------------------------------------------------------------------- ---
    AriaControllers.controller('PostEditCtrl', ['$scope', '$routeParams', 'Post', 'Metatag', '$location', 'flash', '$http', function($scope, $routeParams, Post, Metatag, $location, flash, $http ) {
        $scope.flash = flash;
        $scope.post = Post.get({PostId: $routeParams.PostId});
        $scope.autocompleteTags = false;
        $scope.searchTag = '';

        // callback for ng-click 'deletePost':
        $scope.deletePost = function () {
            $scope.post.$delete({ PostId: $scope.post.id });
        };

        $scope.changeImageName = function (message) {
            var f = jQuery.parseJSON(message.substr(message.indexOf("[")+1,message.lastIndexOf("]")-1));
            $scope.post.coverImage = f.fd.split("/").pop() //prevent file from uploading
            flash.setMessage("Uploaded: "+ $scope.post.coverImage);
            currentMessage = queue.shift() || "";
        };

        // Save post
        $scope.savePost = function () {
            $scope.post.$save({ PostId: $scope.post.id }).then(function (post) {
                flash.setMessage("Saved!");
                $location.path("/post/"+$routeParams.PostId);
            });
        };

        // ---- ------------------------------------------------------------------- ---
        // ---- /post/:id/edit HELPERS                                              ---
        // ---- ------------------------------------------------------------------- ---

        // ---- ------------------------------------------------------------------- ---
        // ---- /post/:id/edit TAG HELPERS                                          ---
        // ---- ------------------------------------------------------------------- ---
        $scope.removeTag = function (TagID) {
            io.socket.delete("/api/post/"+$scope.post.id+"/tags/"+TagID, function (resData) {
                if (typeof resData !== 'undefined' ){
                    $scope.post.tags = resData.tags;
                    $scope.$apply();
                } else {
                    console.log('$scope.findTag > resData:'+resData);
                }
            });
        };

        $scope.addNewTag = function (TagName) {
            io.socket.post("/api/post/"+$scope.post.id+"/tags/", { name: TagName }, function (resData) {
                if (typeof resData !== 'undefined' ){
                    $scope.post.tags = resData.tags;
                    $scope.$apply();
                } else {
                    console.log('$scope.findTag > resData:'+resData);
                }
            });
        };

        $scope.addTag = function (TagID) {
            io.socket.post("/api/post/"+$scope.post.id+"/tags/"+TagID, function (resData) {
                if (typeof resData !== 'undefined' ){
                    $scope.post.tags = resData.tags;
                    $scope.$apply();
                } else {
                    console.log('$scope.findTag > resData:'+resData);
                }
            });
        };

        $scope.findTag = function (TagName) {
            if (TagName != '') {
                io.socket.get("/api/post/findTagByName?name="+TagName, function (resData) {
                    if (typeof resData !== 'undefined' ){
                        $scope.autocompleteTags = resData;
                        $scope.$apply();
                    } else {
                        console.log('$scope.findTag > resData:'+resData);
                    }
                });
            } else {
                console.log('$scope.findTag: false');
                $scope.autocompleteTags = false;
            }
        };

        // ---- ------------------------------------------------------------------- ---
        // ---- /post/:id/edit META-TAG HELPERS                                     ---
        // ---- ------------------------------------------------------------------- ---

        $scope.addNewMetaTag = function () {
            console.log($scope.post.metatags.id);
            if (typeof $scope.post.metatags.id != 'undefined') {
                console.log('not undefined');
                var metatag = Metatag.get({MetatagId: $scope.post.metatags.id});
                metatag.title = $scope.post.metatags.title;
                metatag.description = $scope.post.metatags.description;
                metatag.$save({ MetatagId: $scope.post.metatags.id });
            }
            else {
                var metatag = new Metatag;
                metatag.title = $scope.post.metatags.title;
                metatag.description = $scope.post.metatags.description;
                metatag.$save(function(data){
                    console.log(data.id);
                    $scope.post.metatags.id = data.id;
                    $scope.savePost();
                });
                // $scope.apply();
            }
        };

}]);
































// ---- ------------------------------------------------------------------- ---
// ----                                                                     ---
// ---- Login / Logout Controller                                           ---
// ----                                                                     ---
// ---- ------------------------------------------------------------------- ---
AriaControllers.controller('LoginCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'flash', function($rootScope, $scope, $routeParams, $location, flash) {
	$scope.flash = flash;
	$rootScope.signOut();

}]);

AriaControllers.controller('LogoutCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'flash', function($rootScope, $scope, $routeParams, $location, flash) {
	$scope.flash = flash;
	$rootScope.signOut();
	flash.setMessage("Disconnected");
}]);