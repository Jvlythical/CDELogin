
'use strict';

app.factory('CDESession', [ 'CDEWrite', 'CDEUtil', 'CDECache', 'CDEAuth',
function(CDEWrite, CDEUtil, CDECache, CDEAuth) {
	
	var CDE_STATUS_SUCCESS = true;
	var CDE_STATUS_FAILURE = false;

	var Scope = undefined;
	var CDEUrl = undefined;

	// Application mode
	var TEMP_MODE = 'temp';
	var DEMO_MODE = 'demo';
	var USER_MODE = 'user';

	var Statuses = {
		'init' : false,
		'auth' : false
	}

// *** PUBLIC ***

/* -------------------------------
 *   "Constructor" method
 *    ~ Sets application info
 *    ~ Tries to log user in
 * -------------------------------
 */

	var init = function(config) {

		// Initialize 
		CDEUrl = 'http://' + location.host + '/#/CDE';
		Scope = (config.Scope === undefined ? {} : config.Scope);
	    
		if(Scope.Statuses === undefined)
			Scope.Statuses = {};
		
		setAppInfo(Scope);
		
		CDEAuth.init(Scope);
		
		detectCType(Scope);

		Statuses.init = true;
		
		// Run init callback
		if(config.init_callback !== undefined)
			config.init_callback();

		return CDE_STATUS_SUCCESS;
	}

/* ------------------------------
 *   Handles logging user in
 *    ~ Bootstraps events 
 * ------------------------------
 */

	var login = function(callback) {

	  CDEAuth.loginWithGoogle(function() {

	  	if(callback !== undefined)
	  		callback();

	  });
		
	}
	
	var autoLogin = function(redirect, callback) {
		
	  if(!Statuses.init)
			return CDE_STATUS_FAILURE;

		CDEAuth.checkGoogleLogin(function() {
			
			var stay = (redirect === '#');
			var refresh = (location.href === CDEUrl);

			if(location.href.indexOf(CDEUrl) != -1)
				redirect = location.href;

			if( !stay || refresh )
				window.location.replace(redirect);

			if(callback !== undefined)
				callback();

			if(CDECache.get('c_demo') === 'intro')
				introJs().start();

		});
		
	}

	var logout = function() {
	
		CDEAuth.logoutWithGoogle();

	}

// *** PRIVATE ***

/* ---------------------------------------------
 *  Sets application information 
 *   	~ Must be called before other methods
 * ---------------------------------------------
 */

	var setAppInfo = function(scope) {

		scope.App.hostname = location.hostname;
		scope.App.client = scope.Constants.T_USER;

		if(scope.App.hostname === 'localhost') 
			scope.App.hostname = 'http://localhost:9000';
		
		if(scope.App.hostname === 'cumulus.cs.ucdavis.edu') {
			scope.App.hostname = 'http://cumulus.cs.ucdavis.edu';
			scope.App.production = true;
		} else {
			scope.App.hostname = 'http://localhost:9000'
			scope.App.production = false;
		}

		scope.App.cde_path = CDEUrl;
		scope.Container.name = CDEUtil.getParameter('name');

		if(location.href.indexOf(CDEUrl) == -1)
			scope.App.active = false;
		else
			scope.App.active = true;

	}

/* ------------------------------------------------
 *   Detects the user's browser  
 *   	~ Optional restrict option
 *   	~ If restrict is true, will prevent user
 * ------------------------------------------------
 */

	var detectBrowser = function(restrict) {
		var browser = CDEUtil.checkBrowser();
		
		if(restrict) {
			if(browser !== 'Chrome') { 
				CDEWrite(undefined, 'black_screen');
				CDEWrite('Please try using Chrome!','alert');
			}
		} 

		return browser;
	}

/* ------------------------------------------------
 *   Detects the browser's features  
 *   	~ Should try to find alternate solutions
 * ------------------------------------------------
 */

	var detectFeatures = function() {
		var features = {
			'localStorage' : true,
			'sessionStorage' : true,
			'btoa' : true
		}

		if(!window.localStorage) 
			features.localStorage = false;
			
		if(!window.sessionStorage) 
			features.sessionStorage = false;
			
		if(!btoa) 
			features.btoa = false;

		return features;
	}

	var detectCType = function($scope) {
		var c_type = CDEUtil.getParameter('type');
		var c_name = CDEUtil.getParameter('name');
		var c_demo = CDEUtil.getParameter('p');

		CDECache.put('c_type', c_type);
		CDECache.put('c_name', c_name);
		CDECache.put('c_demo', c_demo);

		if(c_name.length != 0 &&  c_type.length != 0) {
			
			sessionStorage.type = CDEUtil.getParameter('type');
			sessionStorage.container = CDEUtil.getParameter('name');

			// Check which state app is in
			if(CDEUtil.getParameter('p') === 'demo') {
				$scope.App.client = $scope.Constants.T_DEMO;
				localStorage.setItem('user_id', 'demo');
				localStorage.setItem('access_token', 'pass');
			} else {
				$scope.App.client = $scope.Constants.T_TEMP;
				
				if(!$scope.Statuses['signin']) {
					localStorage.setItem('user_id', 'temp');
					localStorage.setItem('access_token', 'pass');
				}
			}
		}
	}

	var setResponsive = function(set) {

		// Remove resize listener
		$(window).off('resize');
		
		// Attach resize listener
		if(set) {
		
			// Initialize responsiveness
			$(window).on('resize', function(event) {
				Scope.$broadcast('resize', event);
			});

			// Trigger a resize to fit the user screen
			Scope.$broadcast('resize');

		}

	}

/* -----------------------------
 *   Application public API   
 *   	~ Returns an object 
 * -----------------------------
 */

	return {
		'init' : init,
		'autoLogin' : autoLogin,
		'login' : login,
		'logout' : logout,
	}

}]);
