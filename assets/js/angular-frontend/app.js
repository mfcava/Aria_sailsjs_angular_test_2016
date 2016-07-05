// ---- ------------------------------------------------------------------- ---
// ----                                                                     ---
// ---- AriaApp Angular Application  - Marco F. Cavaliere                   ---
// ----                                                                     ---
// ---- ------------------------------------------------------------------- ---
var AriaApp = angular.module('AriaApp', [
	'ngRoute',
	'ngResource',
	'ngStorage',
	'AriaControllers',
	'AriaServices',
	'AriaDirective',
	'angulartics',
	'angulartics.google.analytics',
	'infinite-scroll'
]);



























// ---- ------------------------------------------------------------------- ---
// ----                                                                     ---
// ---- AriaApp Init                                                        ---
// ----                                                                     ---
// ---- ------------------------------------------------------------------- ---

AriaApp.run(['$rootScope','$localStorage','$location','$analytics', function($rootScope,$localStorage,$location,$analytics) {
	if ($localStorage.Token)
		$rootScope.Token = $localStorage.Token;

	if ($localStorage.currentUser)
		$rootScope.currentUser = $localStorage.currentUser;

	if ($localStorage.TokenId )
		$rootScope.TokenId = $localStorage.TokenId;

	$rootScope.password = '';
	$rootScope.email    = '';
	// $rootScope.location = $location;
	$rootScope.domain =   $location.protocol()+"://"+$location.host()+":"+$location.port();;

	// console.log('App Init: currentUser. : '+$rootScope.currentUser);
	// console.log('App Init: Token. : '+$rootScope.Token);

	$rootScope.metadata_def = {
		'title': 'Millenials Marketing',
		'description': 'Marketing for millenials brand',
		'keywords': 'Marketing, Millenials, Brands',
		'canonical': '/'
	};

	$rootScope.metadata = $rootScope.metadata_def

	$rootScope.$on('newPageLoaded', function(event, metadata) {
		$rootScope.metadata = metadata;
		setTimeout(function(){ $analytics.pageTrack($location.path() ) }, 1000);
	});

	//$rootScope.$on('routeChangeSuccess', function(event, metadata) {
	//	setTimeout(function(){ $analytics.pageTrack($location.path()+'/' ) }, 10);
	//});

} ]);

















// ---- ------------------------------------------------------------------- ---
// ----                                                                     ---
// ---- AriaApp Controller Definitions                                      ---
// ----                                                                     ---
// ---- ------------------------------------------------------------------- ---

// AriaApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
//	  $routeProvider.

AriaApp.config(['$routeProvider','$locationProvider','$httpProvider','$analyticsProvider', function( $routeProvider, $locationProvider, $httpProvider, $analyticsProvider ) {
	$locationProvider.html5Mode(true);
	$analyticsProvider.virtualPageviews(false);
	$routeProvider
	.when('/', {
		templateUrl: '/partials/home.html',
		controller:  'AriaCtrl' })
	.when('/user', {
		templateUrl: '/partials/users-list.html',
		controller:  'UsersCtrl' })
	.when('/user/:UserId', {
		templateUrl: '/partials/user-details.html',
		controller:  'UserShowCtrl' })
	.when('/post', {
		templateUrl: '/partials/posts-list.html',
		controller:  'PostsCtrl' })
	.when('/post/new', {
		templateUrl: '/partials/post-edit.html',
		controller:  'PostEditCtrl'	})
	.when('/post/:PostId', {
		templateUrl: '/partials/post-details.html',
		controller:  'PostShowCtrl' })
	.when('/article/:TitleSlug', {
		templateUrl: '/partials/post-details.html',
		controller:  'PostShowCtrl'	})
	.when('/post/:PostId/edit', {
		templateUrl: '/partials/post-edit.html',
		controller:  'PostEditCtrl'	})
	.when('/login', {
		templateUrl: '/partials/login.html',
		controller:  'LoginCtrl' })
	.when('/logout', {
		templateUrl: '/partials/logout.html',
		controller:  'LogoutCtrl' })
	// --- ---------------------------------------------- ---
	.otherwise({
		redirectTo: '/',
		controller: 'AriaCtrl'});






	// ---- ------------------------------------------------------------------- ---
	// ----                                                                     ---
	// ---- AriaApp Controller Interceptors                                     ---
	// ---- Add Authentication JWT Token in Header for every Requests           ---
	// ---- ------------------------------------------------------------------- ---
	$httpProvider.interceptors.push(['$q', '$location', '$localStorage','$rootScope', function ($q, $location, $localStorage, $rootScope) {
		return {
			'request': function (config) {
				config.headers = config.headers || {};
				// console.log("App.js: currentUser: ");
				// console.log($rootScope.currentUser);
				// console.log("App.js: TokenID: ");
				// console.log($rootScope.TokenId);
				// console.log("App.js: Insert Token in Header");
				if ($localStorage.Token || $rootScope.Token ) {
					$localStorage.Token = $rootScope.Token;
				    // console.log("App.js: Token -> "+ $localStorage.Token);
					config.headers = {'access_token': $localStorage.Token}
				}
				return config;
			},
			'responseError': function (response) {
				if (response.status === 401 || response.status === 403) {
					$location.path('/login');
					console.log("App.js: Protected Resource");
				}
				return $q.reject(response);
			}
		};
	}]);

} ]);
