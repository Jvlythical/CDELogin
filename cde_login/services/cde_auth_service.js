
'use strict;'

app.factory('CDEAuth', ['$rootScope', 'CDECache', 'GapiWrapper', 'start_container', 'login', 
function($rootScope, CDECache, GapiWrapper, start_container, login) {
	
  var CDE_AUTH_STATUS_SUCCESS = true;
  var CDE_AUTH_STATUS_FAILURE = false;

	var Scope = undefined;
	var User = undefined;
	var Statuses = undefined;
	var Config = undefined;
	var Callbacks = undefined;

// *** PUBLIC ***

	var init = function($scope, config) {
		Scope = $scope;
		User = {};
		Callbacks = {};
		Statuses = {
			'init' : true,
			'auth' : false
		}
		
		Config = (config === undefined ? {} : config);

		if(Config.init_callback !== undefined)
			Config.init_callback();
	}

/* -------------------------------------------------------
 *   Prompts the user to login with google
 *   	~ 3 callbacks
 *   	~ auth_callback => after user logs in
 *   	~ callback      => after wrapper initializes
 *   	~ GoogleAuth    => after wrapper gets user info
 * -------------------------------------------------------
 */

	var loginWithGoogle = function(callback) {

    if(!Statuses.init) 
    	return false;
    		
		Callbacks.GoogleAuth = callback;

		GapiWrapper.init(Scope, {
			'auth_callback' : getGoogleInfo, 
			'callback' : function() {
					GapiWrapper.handleAuthClick(Scope)
			}
    });  
	

	}

/* -------------------------------------------------------
 *   Attempts to log user in
 *   	~ 3 callbacks
 *   	~ auth_callback => after user logs in
 *   	~ callback      => after wrapper initializes
 *   	~ GoogleAuth    => after wrapper gets user info
 * -------------------------------------------------------
 */

	var checkGoogleLogin = function(callback) {
	  
	  if(!Statuses.init) 
			return false; 
        
		GapiWrapper.init(Scope, {

			// Authentication callback
			'auth_callback' : getGoogleInfo,

			// Gapi init callback
			'callback' : GapiWrapper.handleClientLoad

		});
		
		Callbacks.GoogleAuth = callback;

	}

	var logoutWithGoogle = function() {
		
		if(!Statuses.init) 
    	return CDE_AUTH_STATUS_FAILURE;

    if(Scope.App.hostname === undefined)
    	return CDE_AUTH_STATUS_FAILURE;

		Scope.Statuses.signin = false;
		
		// Reset storage
		localStorage.clear();
		sessionStorage.clear();

		// Logout of all google services
		//var ele = '<iframe src="https://accounts.google.com/logout" style="display:none;"></iframe>';
		//$('body').append(ele);
		
		gapi.auth.signOut();

		setInterval(function() {
			window.location.replace(Scope.App.hostname);
		}, 1500);
	}

// *** PRIVATE ***

	var getGoogleInfo = function(resp) {

		CDECache.put('gapi-tok', resp.access_token);
        
		gapi.client.load('plus', 'v1', function() {
		
			var request = gapi.client.plus.people.get({
				'userId': 'me'
			});

			request.execute(function(resp) {

			    try {
    				User.id = resp.id;
    				User.etag = resp.etag;
    				User.email = resp.emails[0].value;
    				User.name = resp.displayName;
    				User.image = resp.image.url;

    				$rootScope.$broadcast('oauth', {
							'email' : User.email,
							'name' : User.name,
							'image' : User.image
						});


			    } catch(err) {

			    }

					loginToBackend(function(data) {
    				    
						if(Callbacks.GoogleAuth !== undefined)
							Callbacks.GoogleAuth();
								
						startContainer(data);

					});
				
			});

		});

	}

/*
 *   Login to CDE backend
 *
 */

	var loginToBackend = function(callback) {

		login(User.id, User.name, User.email, function(data) {
			if(callback !== undefined)
				callback(data);
		});

	}

/*
 *   Starts user container
 *
 */

	var startContainer = function() {

		if(Scope.Statuses.container) 
			return CDE_AUTH_STATUS_FAILURE;

		start_container(User.id, User.etag, User.email, function(data) {

			$rootScope.$broadcast('cstart', data);

		});
		
		return CDE_AUTH_STATUS_SUCCESS;
	}

	return {
		'init' : init,
		'loginWithGoogle' : loginWithGoogle,
		'checkGoogleLogin' : checkGoogleLogin,
		'logoutWithGoogle' : logoutWithGoogle
	}

}]);
 
