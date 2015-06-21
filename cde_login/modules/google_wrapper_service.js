
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
