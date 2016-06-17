var AriaServices  = angular.module('AriaServices', ['ngResource']);
var AriaDirective = angular.module('AriaDirective', []);

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



	AriaServices.factory("flash", ['$rootScope', function($rootScope) {
		var queue = [];
		var currentMessage = "";

		$rootScope.$on("$routeChangeSuccess", function() {
			currentMessage = queue.shift() || "";
		  });

		return {
			setMessage: function(message) { queue.push(message); },
	    getMessage: function() { return currentMessage; }
	  	};
	}]);


    /* **************************************************************************
    *****************************************************************************
    *****************************************************************************
    *****************************************************************************
    *****************************************************************************
    ************************************************************************** */

    /* *********************************************************************** */

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
				      }).
					    success(function(data, status, headers, config) {
						      // console.log('Services.js - signIn - data:');
                  // console.log(data.access_token);
                  $rootScope.setToken(data);
                  console.log('Services.js - signIn: Login Success!');
			            }).
			        error(function(data, status, headers, config) {
						      $rootScope.error = 'Invalid credentials';
			    		    // called asynchronously if an error occurs
			    		    // or server returns response with an error status.
			    	      });
          }
	} ]);

	AriaServices.run([ '$rootScope','$localStorage', function($rootScope,$localStorage) {
			$rootScope.setToken = function(data) {
				 console.log(data);
				 $localStorage.Token = data.access_token;
				 // console.log('Services.js - setToken: -id');
				 console.log(data.user);
				 $localStorage.currentUser = data.user;
				 }
			} ]);

    /* *********************************************************************** */

	AriaServices.run( [ '$rootScope', '$http', function($rootScope, $http) {
	    $rootScope.signOut = function() {
			$http({
				 method: 'GET',
				    url: '/api/auth/logout',
				headers: {'Content-Type': 'application/form-data'}
				}).
					success(function(data, status, headers, config) {
						$rootScope.removeToken(data.token);
			    	}).
			    error(function(data, status, headers, config) {
						$rootScope.error = 'Servie.js - SignOut: Something bad here...';
			    		// called asynchronously if an error occurs
			    		// or server returns response with an error status.
			    	});
            }
	} ]);

    /* *********************************************************************** */

	AriaServices.run([ '$rootScope', '$localStorage', function($rootScope, $localStorage) {
	    $rootScope.removeToken = function(data) {
				delete $localStorage.Token;
				delete $rootScope.Token;
				delete $rootScope.currentUser;
				delete $localStorage.currentUser;
		  	}
    	}
	]);



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



    /* **************************************************************************
    *****************************************************************************
    *****************************************************************************
    *****************************************************************************
    *****************************************************************************
    ***************************************************************************

   AriaServices.factory('Auth', ['$http', '$localStorage', 'urls', function ($http, $localStorage, urls) {
       function urlBase64Decode(str) {
           var output = str.replace('-', '+').replace('_', '/');
           switch (output.length % 4) {
               case 0:
                   break;
               case 2:
                   output += '==';
                   break;
               case 3:
                   output += '=';
                   break;
               default:
                   throw 'Illegal base64url string!';
           }
           return window.atob(output);
       }

       function getClaimsFromToken() {
           var token = $localStorage.token;
           var user = {};
           if (typeof token !== 'undefined') {
               var encoded = token.split('.')[1];
               user = JSON.parse(urlBase64Decode(encoded));
           }
           return user;
       }

       var tokenClaims = getClaimsFromToken();

       return {
           signup: function (data, success, error) {
               $http.post(urls.BASE + '/auth/login', data).success(success).error(error)
           },
           signin: function (data, success, error) {
               $http.post(urls.BASE + '/auth/login', data).success(success).error(error)
           },
           logout: function (success) {
               tokenClaims = {};
               delete $localStorage.token;
               success();
           },
           getTokenClaims: function () { return tokenClaims; }
       };
   }
   ]);


   AriaDirective.factory('Data', ['$http', 'urls', function ($http, urls) {
       return {
           getRestrictedData: function (success, error) {
               $http.get(urls.BASE + '/restricted').success(success).error(error)
           },
           getApiData: function (success, error) {
               $http.get(urls.BASE_API + '/restricted').success(success).error(error)
           }
       };
   }
   ]);

    ** **************************************************************************
    *****************************************************************************
    *****************************************************************************
    *****************************************************************************
    *****************************************************************************
    ************************************************************************** */
