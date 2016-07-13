// ---- ------------------------------------------------------------------- ---
// ----                                                                     ---
// ----                                                                     ---
// ---- Init Service and Helpers                                            ---
// ----                                                                     ---
// ----                                                                     ---
// ---- ------------------------------------------------------------------- ---



var AriaServices  = angular.module('AriaServices', ['ngResource']);
var AriaDirective = angular.module('AriaDirective', []);












    // ---- ---------------------------------------------------------------- ---
    // ----                                                                  ---
    // ---- Routes and Resources                                             ---
    // ----                                                                  ---
    // ---- ---------------------------------------------------------------- ---

	AriaServices.factory('Post', ['$resource',
    	function($resource){
      	  return $resource('/api/post/:PostId', {}, {
          // query: { method:'GET', params:{PostId:''}, isArray:true }
          });
    }]);

	AriaServices.factory('Metatag', ['$resource',
	    function($resource){
	    	return $resource('/api/metatag/:MetatagId', {}, {
	        // query: { method:'GET', params:{PostId:''}, isArray:true }
	    });
	}]);

	AriaServices.factory('Article', ['$resource',
		function($resource){
			return $resource('/api/article/:TitleSlug', {}, {
			// query: { method:'GET', params:{PostId:''}, isArray:true }
		});
	}]);

	AriaServices.factory('User', ['$resource',
		function($resource){
    		return $resource('/api/user/:UserId', {}, {
    		// query: { method:'GET', params:{UserId:'user'}, isArray:true }
    	});
	}]);

	AriaServices.factory('Comment', ['$resource',
		function($resource){
			return $resource('/api/comment/:CommentId', {}, {
			// query: { method:'GET', params:{UserId:'user'}, isArray:true }
		});
	}]);





	// ---- ---------------------------------------------------------------- ---
    // ----                                                                  ---
    // ---- Factory Service for flash message on page Reload                 ---
    // ----                                                                  ---
    // ---- ---------------------------------------------------------------- ---

	AriaServices.factory("flash", ['$rootScope', function($rootScope) {
		var queue = [];
		var currentMessage = {};

		$rootScope.$on("$routeChangeSuccess", function() {
			currentMessage = queue.shift() || "";
		});

		return {
			setMessage: function(message) {
				var m = {};
				if (message.type == null) {
					m = {
						type: 'alert-success',
						details: message
					}
				}
				else {
					m = message;
				}
				queue.push(m);
			},
	    	getMessage: function() {
				$rootScope.flashMessage = currentMessage;
				return currentMessage;
			},
			showMessage: function() {
				currentMessage = queue.shift() || "";
				$rootScope.flashMessage = [currentMessage];
				console.log(currentMessage);
				console.log($rootScope.flashMessage);
			}
		};
	}]);





	// ---- ---------------------------------------------------------------- ---
    // ----                                                                  ---
    // ----  Service Login and Logout                                        ---
    // ----                                                                  ---
    // ---- ---------------------------------------------------------------- ---




	// ---- ---------------------------------------------------------------- ---
    // ---- LOGIN                                                           ---
    // ---- ---------------------------------------------------------------- ---

	AriaServices.run(['$rootScope', '$http', function($rootScope, $http) {
	    $rootScope.signIn = function() {
			var formData = {
			    email:    $rootScope.email,
			    password: $rootScope.password
			};
			$http({
				method: 'POST',
			    url: '/api/auth/login',
			    data: formData,
			    headers: {'Content-Type': 'application/form-data'}
			})
			.success(function(data, status, headers, config) {
				// console.log('Services.js - signIn - data:');
            	// console.log(data.access_token);
            	$rootScope.setToken(data);
        		console.log('Services.js - signIn: Login Success!');
		    })
			.error(function(data, status, headers, config) {
				console.log('Services.js - signIn: some problems!');
				$rootScope.error = 'Invalid credentials';
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
        }
	} ]);

	AriaServices.run([ '$rootScope','$localStorage','$http', function($rootScope,$localStorage,$http) {
		$rootScope.setToken = function(data) {
			// console.log(data);
			$localStorage.Token = data.access_token;
			// console.log($localStorage.Token);
			// console.log(data.user);
			$localStorage.currentUser = data.user;
			$localStorage.TokenId = '';

			$rootScope.Token = data.access_token;
			$rootScope.currentUser = data.user;
			$rootScope.TokenId = '';

			$http({
				method: 'GET',
				url: '/api/user/'+data.user.id+'/jsonWebTokens/',
				headers: {'Content-Type': 'application/form-data'}
			})
			.success(function(tokens, status, headers, config) {
				// Get TokenID for Logout remove;
				angular.forEach(tokens, function(token, key) {
					if (String(token.token) === String(data.access_token)) {
						$localStorage.TokenId = token.id;
						$rootScope.TokenId = token.id;
						}
				});
			})
			.error(function(data, status, headers, config) {
				$rootScope.error = 'Invalid credentials';
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}
	} ]);

	// ---- ---------------------------------------------------------------- ---
    // ---- LOGOUT                                                           ---
    // ---- ---------------------------------------------------------------- ---

	AriaServices.run( [ '$rootScope', '$http', function($rootScope, $http) {
	    $rootScope.signOut = function() {
			$http({
				method: 'GET',
				url: '/api/auth/logout',
				headers: {'Content-Type': 'application/form-data'}
				})
			.success(function(data, status, headers, config) {
				$http({
					method: 'DELETE',
					url: '/api/user/'+$rootScope.currentUser.id+'/jsonWebTokens/'+$rootScope.TokenId,
					headers: {'Content-Type': 'application/form-data'}
					})
				.success(function(data, status, headers, config) {
					$rootScope.removeToken();
				})
				.error(function(data, status, headers, config) {
					$rootScope.error = 'Servie.js - SignOut: Something bad here...';
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				});
			})
			.error(function(data, status, headers, config) {
				$rootScope.error = 'Servie.js - SignOut: Something bad here...';
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
        }
	} ]);

	AriaServices.run([ '$rootScope', '$localStorage', function($rootScope, $localStorage) {
	    $rootScope.removeToken = function() {
			delete $localStorage.Token;
			delete $rootScope.Token;
			delete $rootScope.currentUser;
			delete $localStorage.currentUser;
			delete $rootScope.TokenId;
			delete $localStorage.TokenId;

		}
    } ]);

	// ---- ---------------------------------------------------------------- ---
	// ---- MAILCHIMP SUBSCRIPTION                                                           ---
	// ---- ---------------------------------------------------------------- ---

	AriaServices.run(['$rootScope', '$http','flash', function($rootScope, $http, flash) {
	    $rootScope.newsletter_subscribe = function(mail) {
			$http({
				method: 'POST',
				url: '/api/mailing_list/'+mail.toLowerCase()+'',
				headers: {'Content-Type': 'application/form-data'}
				})
			.success(function(data, status, headers, config) {
				console.log(data);
				flash.setMessage(data.detail);
			})
			.error(function(data, status) {
				var message = {
					type: 'alert-danger',
					detail: data.detail,
				}
				flash.setMessage(message);
				flash.showMessage();
			});
		}
	} ]);

	// ---- ---------------------------------------------------------------- ---
    // ----                                                                  ---
    // ---- DIRECTIVES                                                       ---
    // ----                                                                  ---
    // ---- ---------------------------------------------------------------- ---





	// ---- ---------------------------------------------------------------- ---
    // ---- ngEnter, trig action and overrive the default action             ---
    // ---- ---------------------------------------------------------------- ---

	AriaServices.directive('ngEnter', [ function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 13) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.ngEnter);
	                });
	                event.preventDefault();
	            }
	        });
	    };
	} ]);





	// ---- ---------------------------------------------------------------- ---
    // ---- AriaComments: display Comments model                             ---
    // ---- ---------------------------------------------------------------- ---

	AriaServices.directive('ariaComments', function() {
		return {
    		restrict: 'AE',
			bindToController: true,
			scope: {
				listcomments: "=",
				parentId: "=",
				showModal: "&",
				deleteComment: "&"
			},
    		templateUrl: '/partials/dir-comments.html',
			link : function(scope, element, attrs) {
				angular.forEach(scope.listcomments, function(value, key) {
					// console.log(scope.listcomments[key]);
					angular.forEach(scope.listcomments, function(v, k) {
						if ((value.id == v.parent) && (value.id != v.id)) {
						   scope.listcomments[key].haschild = value.id;
						}
					});
				});
			},
		};
	});
