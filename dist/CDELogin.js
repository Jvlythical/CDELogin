var app = angular.module('CDELogin', [])

app.directive('cdeLogin', ['CDEConstants', 'CDECache', function(CDEConstants, CDECache) {
	
	return {
		link : function(scope, element, attrs) {
			
			CDEConstants.bind(scope);

			scope.init({
				'loginCallback' : function() {
					 	scope.User.access_token = CDECache.get('access_token');
            scope.$apply();
				},
			});

			scope.$on('oauth', function(data) {
				console.log('OAuth');
				console.log(data);
			});

			scope.$on('cauth', function(data) {
				console.log('CAuth');
				console.log(data);
			});

			scope.$on('cstart', function(data) {
				console.log('CAuth');
				console.log(data);
			});

		}
	}

}]);

app.controller('CDELoginCtrl', ['$scope', 'CDESession', 'CDEControlBuffer',
function($scope, CDESession, CDEControlBuffer) {
			
		var Config;
			
    $scope.init = function(config) {
 				
				CDEControlBuffer.bind($scope);
				Config = config;

        // Callbacks are optional, used here for demo
        CDESession.init({
        	'Scope' : $scope,
					'init_callback' : function() {
							
						// Checks if the user has already logged in
						CDESession.autoLogin('#', function() {
							 if(Config.loginCallback !== undefined)
								Config.loginCallback();
						});

					}
        });
        
    }
    
    // Handles user click on login
    $scope.login = function() {
        
        // Callbacks are optional, used here for demo
      CDESession.login(function() {
				if(Config.loginCallback !== undefined)
					Config.loginCallback();
      }); 
       
    }
    
}]);
;
/*
 *   Keys must be delimited by underscores
 *   Values should be delimited by dashes
 *
 */

'use strict';

app.factory('CDEConstants', [function() {

	var bind = function($scope) {

		$scope.LEFT_COL = 'file_nav_col';
		$scope.CENTER_COL = 'editor_col';
		$scope.RIGHT_COL = 'apps_col';
		$scope.EDITOR = 'editor_wrapper';
		$scope.ACTIVE_FILE = 'file_tab_active';
		$scope.INACTIVE_FILE = 'file_tab_inactive';

		$scope.Constants = {
		
			// Adminstrative
			'EXEC_STATE_SLEEPING' : 0,
			'EXEC_STATE_READY' : 1,
			'EXEC_STATE_WAITING' : 2,
			'EXEC_STATE_DEAD' : 3,
			'T_USER' : 'user',
			'T_DEMO' : 'demo',
			'T_TEMP' : 'temp',
			'T_INTRO' : 'intro',
			
			// Display
			'FILE_NAV_WRAPPER' : 'file_nav_wrapper',
			'FILE_NAV_CONTAINER' : 'file_nav_container',
			'OVERLAY' : 'black_screen',
			'BACKGROUND' : 'background_div',
			'THREE_COL' : '3_col_split',

			// Progressbars
			'EXEC_PROGRESSBAR' : 'exec-progress'
		}
		
		$scope.ADT = {
			'File' : {
				'id' : undefined,
				'name' : undefined,
				'path' : undefined,
				'rtime' : undefined,
				'wtime' : undefined,
				'etime' : undefined,
				'open' : undefined
			},
			'Commit' : {
				'offset' : undefined,
				'id' : undefined,
				'additions' : '',
				'deletions' : '',
				'style' : undefined
			}

		}

	}

	return  {
		'bind' : bind
	}
		
}]);
;app.factory('CDEControlBuffer', [function() {
	
	var bind = function(scope) {
		
		// Application Control Buffer
		scope.App = {
			'active' : true,
			'hostname' : undefined,
			'cde_path' : undefined,
			'production' : undefined,
			'client' : undefined,
			'display_mode' : undefined
		}

		// Firebase Control Buffer
		scope.FireBase = {
			'Container' : {
				'collaborators' : undefined,
				'permission' : undefined
			},
			'FileSystem' : {
				'data' : undefined
			}
		};

		// Exec Control Buffer
		scope.Exec = {
			'display' : false,
			'state' : undefined,
			'stdout' : undefined,
			'stderr' : undefined,
			'stdtest' : undefined,
			'history' : []
		}
		
		// User Control Buffer
		scope.User = {
		 'user_id' : undefined,
		 'access_token' : undefined,
		 'email' : undefined,
		 'first_name' : undefined,
		 'last_name' : undefined,
		 'image' : undefined,
		 'actions' : [],
		 'permissions' : {
				'read' : undefined,
				'write' : undefined,
				'execute' : undefined
		 },
		 'ltime' : undefined,
		 'errors' : {
			'lattempts' : 0,
			'rattempts' : 0
		 }
		}

		// Container Control Buffer
		scope.Container = {
			'name' : undefined,
			'permission' : undefined,
			'user' : undefined,
			'group' : undefined
		}

		// Editor Control Buffer
		scope.TabContent = []; // For legacy purposes
		scope.Editor = {
			'tabs' : scope.TabContent,
			'active' : undefined, 
			'count' : 0
		}

		// Mins Control Buffer
		scope.Mins = {
			'name' : undefined
		};
		
		// Statuses Control Buffer
		scope.Statuses = {
			'auth' : false, // Mutex for user model 
			'apps' : false, // Handles toggling apps view
			'container' : false, // Mutex for container init
			'fnav' : false, // Mutex for file nav init
			'signin' : false
		}

	}

	return {
		'bind' : bind
	}

}]);
;
/* --------------------------------------
 *     Path manager which contains: 
 *     	~ Rails paths
 *     	~ Firebase paths
 *     	~ Frontend paths
 * ---------------------------------------
 */

'use strict;'

app.factory('CDEPath', [function() {

	var frontend_templates = 'views/templates';
	var firebase_root = 'resplendent-heat-459.firebaseio.com';
	var rails_backend = 'http://localhost:3000';

	if(location.hostname === 'cumulus.cs.ucdavis.edu') 
		rails_backend = 'http://cumulus.cs.ucdavis.edu';

// *** Frontend ***
	var FrontendPaths = {
		
		// File System
		'file_nav_template' : frontend_templates + '/modules/fnav/file_nav_template.html',
		'share_file_template' : frontend_templates + '/modules/fnav/overlay/share_file_template.html',
		'import_file_template' : frontend_templates + '/modules/fnav/overlay/import_file_template.html',
		'move_file_template' : frontend_templates + '/modules/fnav/overlay/move_file_template.html',

		// Apps
		'snapshots_mins_template' : frontend_templates + '/modules/apps/snapshots_mins_template.html',
		'git_template' : frontend_templates + '/modules/apps/git_template.html',
		'settings_template' : frontend_templates + '/modules/apps/settings_template.html',

		// Search
		'search_file_template' : frontend_templates + '/modules/search_file_template.html',

		// Editor
		'run_output_template' : frontend_templates + '/modules/editor/run_output_template.html',

		// Messages
		'messages_template' : frontend_templates + '/modules/messages_template.html',
		
		// CDE
		'CDE' : 'http://' + location.host + '/#/CDE'
	};

// Backend
	var BackendPaths = {
		'rails_backend' : rails_backend,
		'compile_controller' : rails_backend + '/compile/compile_file',

		'start_container' : rails_backend + '/containers/start_container',
		'user_container_files' : rails_backend + '/containers/get_user_files',
		'delete_container_file' : rails_backend + '/containers/delete_file',
		'update_container_file' : rails_backend + '/containers/update_file',
		'rename_container_file' : rails_backend + '/containers/rename_file',
		'container_file_content' : rails_backend + '/containers/file_content',
		'download_container_file' : rails_backend + '/containers/download_file',
		'insert_container_file' : rails_backend + '/containers/upload_file',
		'create_container_file' : rails_backend + '/containers/create_file',
		'move_container_file' : rails_backend + '/containers/move_file',
		'stop_container' : rails_backend + '/containers/stop_container',
		'share_container_file' : rails_backend + '/containers/share_container_file',
		'copy_container_file' : rails_backend + '/containers/copy_container_file',
		'create_container_project' : rails_backend + '/containers/create_project',
		'start_temp_container' : rails_backend + '/containers/start_temp_container',
		'container_permission' : rails_backend + '/containers/change_permission',
		'add_container_member' : rails_backend + '/containers/add_member',
		'forK_container' : rails_backend + '/containers/fork',
		
		'content_controller' : rails_backend + '/users/download_file',
		'login_controller' : rails_backend + '/users/create_user',
		'update_user_tabs' : rails_backend + '/users/set_user_tabs',
		'get_user_tabs' : rails_backend + '/users/get_user_tabs',
		
		'send_message' : rails_backend + '/messages/send_message',
		'get_received_messages' : rails_backend + '/messages/get_messages',
		'get_sent_messages' : rails_backend + '/messages/get_sent_messages',

		'git_commit' : rails_backend + '/git/commit',
		'git_diff' : rails_backend + '/git/diff',
		'git_checkout' : rails_backend + '/git/checkout',
		'git_pull' : rails_backend + '/git/clone',
		'git_push' : rails_backend + '/git/push',
		'git_log' : rails_backend + '/git/log',
		
		'save_controller' : 'save_location'
	};

// Firebase
	var FirebasePaths = {
		'firebase_root' : firebase_root
	}

// Map key to path
	return function(key) {
		if(BackendPaths[key] != undefined) 
			return BackendPaths[key];
		else if (FrontendPaths[key] != undefined) 
			return FrontendPaths[key];
		else if(FirebasePaths[key] != undefined)
			return FirebasePaths[key];
		else 
			return undefined;
	}

}]);
;
/* ----------------------------------------------
 *   Injectable service for global caching 
 *   	~ Returns a cache with key 'CDECache'
 * ----------------------------------------------
 */

'use strict;'

app.factory('CDECache', ['$rootScope', '$cacheFactory', function($rootScope, $cacheFactory) {
	
	var CDE_CACHE_STATUS_SUCCESS = true;
	var CDE_CACHE_STATUS_FAILURE = false;
	var CDE_CACHE_EXPIRE_TIME = 1800000;

	var cache = $cacheFactory('CDECache');

	var get = function(key) {

		if(!sessionCheck()) {
			clearCache();
			$rootScope.$broadcast('session-expire');
		}

		return cache.get(key)
	}

	var put = function(key, val) {
		
		if(!sessionCheck()) {
			clearCache();
			$rootScope.$broadcast('session-expire');
		}

		cache.put(key, val);
	}

	var clearCache = function() {	
		cache.removeAll();
	}

// *** PRIVATE ***

	var sessionCheck = function() {
		var time = (new Date).getTime();
		
		if(cache.get('STime') === undefined)
			cache.put('STime', time);

		if(time - cache.get('STime') < CDE_CACHE_EXPIRE_TIME) 
			return CDE_CACHE_STATUS_SUCCESS;
		else
			return CDE_CACHE_STATUS_SUCCSS;
	}
	
	return {
		'get' : get,
		'put' : put,
		'clear' : clearCache

	}
}]);
;
'use strict;'

app.factory('CDEHttp', ['$rootScope', '$http', 'CDECache', 'CDEWrite', 
function($rootScope, $http, CDECache, CDEWrite) {
	
	var HTTP_STATUS_SUCCESS = true;
	var HTTP_STATUS_FAILURE = false;

	var Config = {};
	var Statuses = {};

// *** PUBLIC ***

	var init = function(config) {
		
		if(typeof(config) === 'object')
			return HTTP_STATUS_FAILURE;
		
		Config = (config === undefined ? Config : config);
		Statuses.init = true;

		return HTTP_STATUS_SUCCESS;
	}

/* ------------------------------------------
 *   Construct template get request
 *   	~ Attach (If container is user):
 *   	~ 	user_id
 *   	~ 	access_token
 *   	~ Attach (If container is non-user)
 *   	~ 	container
 *   	~ 	user_mode
 * ------------------------------------------
 */

	var GetRequest = function(url) {
		var user_id = CDECache.get('user_id');
		var access_token = CDECache.get('access_token');
		var container = CDECache.get('container');
		var user_mode = CDECache.get('type');
		
		if(user_id == undefined || access_token == undefined) {
			user_uid = '';
			access_token = '';
		}
		
		var params = '?user_id=' + user_id + '&access_token=' + access_token;
		var path = url + params;
	
		if(container != undefined && user_mode != undefined) {
			path = path + '&name=' +  container;
			path = path + '&type=' + user_mode;
		}

		return path;
	}
		var mergeParams = function(dest, src) {
		for(var attr in src) 
			dest[attr] = src[attr];
	}

	var mergePath = function(path, params) {

		for(var attr in params) 
			path += '&' + attr + '=' + params[attr];

		return path;
	}

/* ------------------------------------------
 *   Construct template post request
 *   	~ Attach (If container is user)
 *   	~ 	user_id
 *   	~ 	access_token
 *   	~ Attach (If container is non-user)
 *   	~ 	container
 *   	~ 	user_mode
 * ------------------------------------------
 */

	var PostParams = function() {
		var user_id = CDECache.get('user_id');
		var access_token = CDECache.get('access_token');
		var container = CDECache.get('container');
		var user_mode = CDECache.get('type');

		if(user_id == undefined || access_token == undefined) 
			return undefined;
		
		var params = {
			'user_id' : user_id,
			'access_token' : access_token
		}

		if(container != undefined && user_mode != undefined) {
			params.name = container;
			params.type = user_mode;
		}

		return params;
	}

	var sendGetRequest = function(fid, url, callback) {

		try {

			if(Config.debug_flag) {
				$http.get(url)
					.success(function(data, status, headers, config) {

						if(callback !== undefined)
							callback(data);

					})
					.error(function(data, status, headers, config) {
						CDEWrite(data, 'console', fid);
					});

			} else {

				$.get(url)
					.success(function(data) {
						
						if(callback !== undefined)
							callback(data);

					})
					.error(function(xhr, status, error) {
						handleError(xhr.status);
					});
			}
		} catch(err) {

		}
	}

	var sendPostRequest = function(fid, url, params, callback) {
		
		try {

			if(Config.debug_flag) {

				$http.post(url, params)
					.success(function(data, status, headers, config) {

						if(callback !== undefined)
							callback(data);

					})
					.error(function(data, status, headers, config) {
						CDEWrite(data, 'console', fid);
					});

			} else {

				$.post(url, params)
					.success(function(data) {
						
						if(callback !== undefined)
							callback(data);

					})
					.error(function(xhr, status, error) {
						handleError(xhr.status);
					});
					
			}
		} catch(err) {

		}

	}

	var setDebugMode = function(flag) {

		if(flag === undefined)
			return HTTP_STATUS_FAILURE;

		Config.debug_flag = flag

		return HTTP_STATUS_SUCCESS;
	}

	var handleError = function(code) {

		switch(code) {
			case 400:
				$rootScope.$broadcast('cde.req-fault');
			case 401:
				$rootScope.$broadcast('cde.acc-fault');
				break;
			default:
				break;
		}
	}

	return {
		'GetRequest' : GetRequest,
		'mergeParams' : mergeParams,
		'mergePath' : mergePath,
		'PostParams' : PostParams,
		'sendGetRequest' : sendGetRequest,
		'sendPostRequest' : sendPostRequest,
		'setDebugMode' : setDebugMode
	}

}]);
;app.factory('CDEOut', [function() {
	
	var CDEOUT_OVERLAY = 'black_screen';
	var CDEOUT_STATUS_FAILURE = false;
	var CDEOUT_STATUS_SUCCESS = true;

	var Production = false;
	var Statuses = {};

// *** PUBLIC ***

	var init = function(config) {
		
		if(typeof(config) !== 'object')
			return CDEOUT_STATUS_FAILURE;

		if(config.Production !== undefined)
			Production = config.Production;
		
		Statuses.init = true;
	}

	var print2Console = function(sender, message) {
		
		if(message === undefined)
			return CDEOUT_STATUS_FAILURE;

		if(!Production) {	
		
			if(sender !== undefined)
				console.log(sender + message);
			else
				console.log(message);

		}

		return CDEOUT_STATUS_SUCCESS;
	}

	var print2Alert = function(sender, message) {
		
		if(message === undefined)
			return CDEOUT_STATUS_FAILURE;
		
		if(sender === undefined)
			alert(message)
		else
			alert(sender + message);

		return CDEOUT_STATUS_SUCCESS;
	}

	var displayOverlay = function() {
		
		var $overlay = $('#' + CDEOUT_OVERLAY);

		if(!$overlay.length) {
			var el = '<div id="' + CDEOUT_OVERLAY + '"></div>';
			$('body').append(el);
		} else {
			$overlay.css('display', 'block');
		}

		$(document).on('keyup', function(event) {
			if(event.which == 27) 
				removeOverlay();
		});
		
		return CDEOUT_OVERLAY;
	}

	var removeOverlay = function() {

		var $overlay = $('#' + CDEOUT_OVERLAY);

		if(!$overlay.length)
			return CDEOUT_STATUS_FAILURE;

		$(document).off('keyup');
		$overlay.empty();
		$overlay.css('display', 'none');

		return CDEOUT_STATUS_SUCCESS;
	}

	var displayProgressbar = function(id, percent) {
		
		if(id === undefined)
			return CDEOUT_STATUS_FAILURE;

		var $target = $('#' + id);

		if(!$target.length)
			return CDEOUT_STATUS_FAILURE;

		if(percent == 0) {
			
			$target.find('.progress').remove();
	
			return CDEOUT_STATUS_SUCCESS;
		}

		var ele = 
			'<div class="progress progress-striped active" style="border-radius:1px; margin:0;">' +
				'<div class="progress-bar progress-bar-info" role="progressbar" ' + 
					'aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100"' +
					'style="width: ' + percent + '%">' +
					'<span class="sr-only">' + percent + '% Complete</span>' + 
				'</div>' + 
			'</div>';

		$target.html(ele);

		return CDEOUT_STATUS_SUCCESS;
	}

	var newTab = function(href) {
		
		if(href === undefined)
			return CDEOUT_STATUS_FAILURE;

		window.open(href, '_blank');

		return CDEOUT_STATUS_SUCCESS;
	}

	return {
		'init' : init,
		'console' : print2Console,
		'alert' : print2Alert,
		'overlay' : displayOverlay,
		'removeOverlay' : removeOverlay,
		'progressbar' : displayProgressbar,
		'tab' : newTab
	}

}]);
;'use strict';

app.factory('CDEUtil', [function() {

	var debug_flag = false;

// *** PUBLIC ***

	var alphaHash = function(l, pos) { 
		var charCode = l.toLowerCase().charCodeAt(pos);
		var base = 'a'.charCodeAt(0);
		return charCode - base;
	};

	var argsNotUndefined = function(args, len) {

		for(var i = 0; i < len; ++i) 
			if(args[i] === undefined)
				return false;

		return true;

	}

	var checkBrowser = function () {
		var c = navigator.userAgent.search("Chrome");
    var f = navigator.userAgent.search("Firefox");
    var m8 = navigator.userAgent.search("MSIE 8.0");
    var m9 = navigator.userAgent.search("MSIE 9.0");
   	var brwsr = undefined;

    if (c > -1){
      brwsr = "Chrome";
    } else if(f > -1){
      brwsr = "Firefox";
    } else if (m9 > -1){
      brwsr ="MSIE 9.0";
    } else if (m8 > -1){
      brwsr ="MSIE 8.0";
    }

    return brwsr;
	};

	var convertUrl = function(url) {
		var params = url.substr(url.indexOf('?'));

		return 'http://' + location.host + '/#/CDE' + params;
	}

	var getActiveTab = function(TabContents) {
		for(var i in TabContents) {
			if(TabContents[i].tab_class == 'file_tab_active') 
				return TabContents[i];
		}

		return undefined;
	};

	var getParameter = function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		
		results = regex.exec(location.href);
	  
	  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var htmlspecialchars_encode = function(text) {
		var map = {
			'&' : '&amp;',
			'<' : '&lt;',
			'>' : '&gt;',
			'"' : '&quot;',
			"'" : '&#039;',
			'\n' : '<p>'
		};

  	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	};

	var htmlspecialchars_decode = function(text) {
		var map = {
			'<br/>' : '\n',
			'<br />' : '\n',
			'&amp;' : '&',
			'<' : '&lt;',
			'>' : '&gt;',
			'"' : '&quot;',
			"'" : '&#039;'
		};
		
		for(var key in map) text = text.replaceAll(map[key], key);

		return text;
	};

	var isInspectOpen = function() {
    console.profile(); 
    console.profileEnd(); 
    
    if (console.clear) console.clear();
    return console.profiles.length > 0;
	};

// *** PRIVATE ***

/* ---------------------------
 *   Util public API
 *   	~ Returns an object
 * ---------------------------
 */

	return {
		'alphaHash' : alphaHash,
		'argsNotUndefined' : argsNotUndefined,
		'checkBrowser' : checkBrowser,
		'convertUrl' : convertUrl,
		'getActiveTab' : getActiveTab,
		'getParameter' : getParameter,
		'htmlspecialchars_encode' : htmlspecialchars_encode,
		'htmlspecialchars_decode' : htmlspecialchars_decode,
		'isInspectOpen' : isInspectOpen,
	}

}]);
;app.factory('CDEWrite', [function() {
	
	var debug_flag = 1;

	var displayBlackScreen = function() {

		var OVERLAY = 'black_screen';
		var $black_screen = $('#' + OVERLAY);

		$black_screen.css('display', 'block');

		$(document).off('keyup');
		$(document).on('keyup', function(event) {
				if(event.which == 27) {
					$black_screen.empty();
					$black_screen.css('display', 'none');
				}
		});
	}
	
	return function(message, format, description) {
		var format_ar = {
			'console' : 0,
			'black_screen' : 1,
			'alert' : 2,
			'progressbar' : 3
		}
		
		if(format_ar[format] == undefined) {
			console.log('Unable to display the message!');
			return false;
		}
		
		switch(format_ar[format]) {
			case 0:
				
				if(description != undefined) 
					message = description + message;

				if(debug_flag)	
					console.log(message);

				break;
			case 1:
				displayBlackScreen();
				return OVERLAY;
			case 2: 
				if(description != undefined) message = description + message;
				alert(message);
				break;
			case 3:
				var $target = $('#' + description);

				if(message == 0) {
					$target.find('.progress').remove();
					return false;
				}

  			var ele = 
  				'<div class="progress progress-striped active" style="border-radius:1px; margin:0;">' +
  					'<div class="progress-bar progress-bar-info" role="progressbar" ' + 
  						'aria-valuenow="' + message + '" aria-valuemin="0" aria-valuemax="100"' +
  						'style="width: ' + message + '%">' +
   	 					'<span class="sr-only">' + message + '% Complete</span>' + 
   	 				'</div>' + 
   	 			'</div>';


   	 		$target.html(ele);

   	 		break;
			default:
				break;
		}
	}

}]);
;
/* --------------------------------------------------------
 *   Typical usage:
 *
 *   	~ GapiWrapper.init($scope, {
 *   			auth_callback : auth_callback,
 *   			callback : callback
 *   		});
 *
 *   	~ Handles authenticating with google
 *   	~ Calls callback when GapiWrapper.init finishes
 *   	~ Calls auth_callback when user is authenticated
 * --------------------------------------------------------
 */

'use strict';

app.factory('GapiWrapper', ['CDECache', function(CDECache) {
	
	// Scope of calling controller
	var Scope = undefined;
	var AuthCallback = undefined;
	var GapiStatuses = {
		'init' : false
	}

	// Gapi source
	var GapiSrc = 'https://apis.google.com/js/platform.js';

	// Google Client
	var ClientId = undefined;
	var ApiKey = undefined;

	// Google Scopes
	var GoogleScopes = undefined;


// *** PUBLIC ***

/* -----------------------------------------
 *   Initializes the gapi client
 *   	~ Sets the client id and api key
 *   	~ Sets the required google scopes
 *   	~ Calls callback on success
 * -----------------------------------------
 */

	var init = function($scope, config) {
		
		$.getScript(GapiSrc)
			.done(function(script, textStatus) {

				Scope = $scope; 
				
				// Set client credentials
				if(config.client_id !== undefined && config.api_key !== undefined)
					setGoogleClient(config.client_id, config.api_key);
				else
					setGoogleClient();
				
				// Set google scopes
				if(config.google_scopes !== undefined)
					setGoogleScopes(config.google_scopes);
				else
					setGoogleScopes();
				
				// Set authentication callback
				if(config.auth_callback !== undefined)
					AuthCallback = config.auth_callback;
				else
					AuthCallback = handleAuthResult;
				
				// Client is initialized
				GapiStatuses.init = true;
			
				if(config.callback !== undefined)
					config.callback();

			})
			.fail(function(jqxhr, settings, exception) {
				// Fail handle here
			});

	}

/* -------------------------------------------------
 *   Recommended to used after GapiWrapper.init
 *   	~ Tries to initialize client
 *   	~ Checks if user is authenticated
 * -------------------------------------------------
 */

	var handleClientLoad = function() {
	
		// Verify
		if(!GapiStatuses.init)
			return false;

		// Begin
		try {
			gapi.client.setApiKey(ApiKey);
			window.setTimeout(checkGoogleAuth,1);
		} catch(err) {
			//Do something
		}

	}

/* ---------------------------------------------------
 *   Handles auth trigger event
 *   	~ Client must be initialized
 *   	~ Asks user to login with Gmail account
 *   	~ Uses AuthCallback as default callback
 * ---------------------------------------------------
 */

	var handleAuthClick = function($scope) {
		
		// Verify
		if(!GapiStatuses.init)
			return false;

		// Begin
		gapi.auth.authorize({
			client_id: ClientId, 
			scope: GoogleScopes, 
			immediate: false,
			cookie_policy: 'single_host_origin',
			response_type: 'token id_token'
		}, AuthCallback); 

		return false;
	}

// *** GET METHODS ***

	var getGoogleScopes = function() {
		return GoogleScopes;
	}

	var getStatuses = function() {
		return GapiStatues;
	}

	var getGoogleContacts = function(gaccess_token, callback) {
			
		$.ajax({
			url : 'http://www.google.com/m8/feeds/contacts/default/full?access_token=' + CDECache.get('gapi-tok') + '&max-results=999',
			jsonp : 'callback',
			dataType : 'jsonp',
			success : function(data) {
				var xmlDoc = [];
				var contacts = [];

				if(window.DOMParser) {
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(data,"text/xml");
				} else {
					var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async = false;
					xmlDoc.loadXML(data);
				}

				var entries = xmlDoc.getElementsByTagName('entry');

				for(var i in entries) {
					var last_child_node = entries[i].lastChild;
					if(last_child_node == undefined) continue;

					var email = last_child_node.getAttribute('address');
					if(email == undefined) continue;

					var title_node = entries[i].childNodes[3];
					var name = title_node.textContent;

					contacts.push(name + ' (' + email + ')');
				}
				
				if(callback != undefined) callback(contacts);
			}
		});

	}


// *** PRIVATE ***

/* ----------------------------------------------
 *  Sets Google API credentials
 *   	~ Use Martin's credentials if production
 *   	~ Otherwise use mine
 * ----------------------------------------------
 */

	var setGoogleClient = function(client_id, api_key) {
		
		if(client_id !== undefined && api_key !== undefined) {
			ClientId = client_id;
			ApiKey = api_key;
		} else {

			if(Scope.App.production){
				ClientId = '261784489223-v1gi00vigpfs7aodkbiilk36k8dlje4j.apps.googleusercontent.com'; // Martin
				ApiKey = 'AIzaSyAjFkR8Unwd_Kt5BXZ4MpSWjTCzxxb52G4'; // Martin -- API
			} else {
				ClientId = '344688152776-bvj201ldvethrpafcshg42q6nuhdimga.apps.googleusercontent.com'; // Michael
				ApiKey = 'AIzaSyCj5ySyY4SDehx0d-SG4NCF6ICQDyr14Uo'; // Michael -- API
			}

		}

	}
	
/* ---------------------------------------------------
 *   Sets which scopes to request user permission  
 *   	~ Scopes must be set before trying to login
 *   	~ Default provided if argument is null
 * ---------------------------------------------------
 */

	var setGoogleScopes = function(google_scopes) {
		
		var user_profile = 'https://www.googleapis.com/auth/userinfo.profile ';
		var user_email = 'https://www.googleapis.com/auth/userinfo.email ';
		var user_contacts = 'https://www.googleapis.com/auth/contacts.readonly';  

		if(google_scopes !== undefined)
			GoogleScopes = google_scopes;
		else
			GoogleScopes = user_profile + user_email + user_contacts;
		
	}

/* --------------------------------------------
 *   Checks if the client is authenticated
 *   	~ Async call to Google to auth user
 *   	~ Uses AuthCallback as default
 * --------------------------------------------
 */

	var checkGoogleAuth = function() {
		gapi.auth.authorize({
			client_id: ClientId, 
			scope: GoogleScopes, 
			immediate: true,
			cookie_policy: 'single_host_origin'
		}, AuthCallback);
	}

/* ------------------------------------
 *   Default auth callback
 *   	~ Doesn't really do anything
 * ------------------------------------
 */  

	var handleAuthResult = function() {
		return false;
	}

/* -----------------------------
 *   Application public API   
 *   	~ Returns an object 
 * -----------------------------
 */

	return {

		// Must be called first
		'init' : init,

		'handleAuthClick' : handleAuthClick,
		'handleClientLoad' : handleClientLoad,
		'getStatuses' : getStatuses,
		'getScopes' : getGoogleScopes,
		'getContacts' : getGoogleContacts
	}

}]);
;app.factory('login', ['$rootScope', 'CDEPath', 'CDEWrite', 'CDEUtil', 'CDECache',
function($rootScope, get_path, CDEWrite, CDEUtil, CDECache) {

	return function(user_id, full_name, email, callback) {
		
		if(CDEUtil.getParameter('name').length != 0) {
			var container = CDEUtil.getParameter('name');

			sessionStorage.setItem('container', container);
			CDECache.put('container', container);
		}
			
		if(CDEUtil.getParameter('type').length != 0) {
			var type = CDEUtil.getParameter('type');
			
			sessionStorage.setItem('type', type);
			CDECache.put('type', type);
		}
			
		if(full_name === undefined) {

			CDECache.put('user_id', '');
			CDECache.put('access_token', '');

			localStorage.setItem('user_id', '');
			localStorage.setItem('access_token', '');
			
			$rootScope.$broadcast('cauth', {
				'uid' : '',
				'access_token'  : ''
			});

			if(callback !== undefined) 
				callback();

			return false;
		}

		var name_ar = full_name.split(' ');

		$.post(get_path('login_controller'), {
			'user_id' : user_id,
			'first_name' : name_ar[0],
			'last_name' : name_ar[name_ar.length - 1],
			'email' : email
		}, function(data) {
		
				sessionStorage.clear();
				
				CDECache.put('access_token', data.replace(/"/g, ''));
				CDECache.put('user_id', user_id);

				localStorage.setItem('access_token', data.replace(/"/g, ''));
				localStorage.setItem('user_id', user_id);

				$rootScope.$broadcast('cauth', {
					'uid' : user_id,
					'access_token'  : data.replace(/"/g, '')
				});

				if(callback !== undefined) 
					callback(data);

		});
	}

}]);
;app.factory('start_container', ['CDEPath', 'CDEWrite', 'CDEUtil', function(CDEPath, CDEWrite, CDEUtil) {
	var terminal_id = 'terminal_iframe';

	return function(id, etag, email, callback) {
		var type = undefined
		var name = undefined;

		if(id == undefined) 
			id = "";

		if(etag == undefined) 
			etag = "";

		if(email == undefined) 
			email = "";

		if(CDEUtil.getParameter('type') !== "") 
			type = CDEUtil.getParameter('type');
			
		if(CDEUtil.getParameter('name') !== "") 
			name = CDEUtil.getParameter('name');

		if(type !== undefined && name !== undefined) {
			var parameters = {
				'id' : id,
				'etag' : etag,
				'email' : email,
				'type' : type,
				'name' : name
			}
		} else {
			var parameters = {
				'id' : id,
				'etag' : etag,
				'email' : email
			}
		}

		$.post(CDEPath('start_container'), parameters, function(data) {
		
			if(callback != undefined) 
				callback(data);

		});

	}
}]);
;
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
 
;
'use strict;'

app.factory('CDEFirebase', ['$rootScope', 'CDEWrite', 
function($rootScope, CDEWrite) {
	
	var FB_PATH = 'https://resplendent-heat-459.FireBaseio.com/';

	var FBWRAPPER_STATUS_SUCCESS = true;
	var FBWRAPPER_STATUS_FAILURE = false;

	var Scope = undefined;
	var Statuses = {};

// *** PUBLIC ***

/* ------------------------------------------------
 *   Initializes FB references relevant to app
 *    ~ Defines FB model passed by caller
 *   	~ Creates a reference for each key
 *   	~ Attaches listeners to the references
 * ------------------------------------------------
 */
	
	var init = function(config) {
		
		if(typeof(config) !== 'object')
			return FBWRAPPER_STATUS_FAILURE;

		Scope = config.Scope;
	
		initRefs(Scope.FireBase);
		attachListeners(Scope.Container);
		
		Statuses.init = true;
	}

/* --------------------------------------------------
 *   Copies one branch in firebase to another 
 *    ~ Get the data in the branch
 *   	~ Set the other branch with retrieved data
 * --------------------------------------------------
 */

	var copy = function(oldRef, newRef) {
		oldRef.once('value', function(snap)  {
			newRef.set( snap.value(), function(error) {
				if( error && typeof(console) !== 'undefined' && console.error) {  
					console.error(error); 
				}
			});
  	});
	}

/* -----------------------------------------------
 *  Movies one fire branch to another
 *    ~ Check if data is valid
 *   	~ Announce that editor has changed
 * -----------------------------------------------
 */

	var move = function() {
		oldRef.once('value', function(snap)  {
			newRef.set( snap.value(), function(error) {
				
				if( !error ) 
					oldRef.remove(); 
				else if( typeof(console) !== 'undefined' && console.error ) 
					console.error(error); 
			
			});
		});
	}

// *** PRIVATE ***

/* ------------------------------------------------
 *   Re-evaluates the Container's group members
 *   	~ Get data from firebase
 *   	~ Push members into an array
 *   	~ Announce that group has changed
 * ------------------------------------------------
 */

	var initRefs = function(FBModel) {
		
		var root = FB_PATH + Scope.Container.name;

		for(var key in FBModel) {
			
			var node = FBModel[key];

			if(typeof(node) === 'object') {
				for(var prop in node) {
					var ref_path = root + '/' + key + '/' + prop
					FBModel[key][prop] = new Firebase(ref_path);
				}
			} else {
				var ref_path = root + '/' + key;
			
				FBModel[key] = new Firebase(ref_path);
			}
		}

	}

	var attachListeners = function(Container) {
		
		var fb_container = Scope.FireBase.Container;
		var fb_fs = Scope.FireBase.FileSystem;
		
		// Container
		fb_container.permission.on('value', function(snapshot) {
			Container.permission = snapshot.val();
			$rootScope.$broadcast('permission-change');
		});

		fb_container.collaborators.on('value', function(snapshot) {
			Container.group = handleGroupChange(snapshot);

			$rootScope.$broadcast('collaborator-change', snapshot);
		});

		// File-system
		fb_fs.data.on('value', function(snapshot) {
			var data = snapshot.val();

			$rootScope.$broadcast('fnav.new_data', data);
		});

	}

	var handleGroupChange = function(snapshot) {
		var data = snapshot.val();
		var new_group = [];

		if(data === null) 
			return new_group;
			
		// Update group members
		snapshot.forEach(function(s) {
			var user = s.val();

			if(user.length == 0)
				return false;
			else
				new_group.push(JSON.parse(user));
		});
		

		return new_group;
	}

/* ---------------------------
 *   Expose public API
 *   	~ returns an object 
 * ---------------------------
 */ 

	return {
		init : init,
		copy : copy,
		move : move
	}

}]);
;
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
