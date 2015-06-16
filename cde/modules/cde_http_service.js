
'use strict;'

app.factory('CDEHttp', ['$http', 'CDECache', 'CDEWrite', 
function($http, CDECache, CDEWrite) {
	
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
					CDEWrite(xhr.responseText, 'console', fid);
				});
				
		}

	}

	var sendPostRequest = function(fid, url, params, callback) {
		
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
					CDEWrite(xhr.responseText, 'console', fid);
				});
				
		}

	}

	var setDebugMode = function(flag) {

		if(flag === undefined)
			return HTTP_STATUS_FAILURE;

		Config.debug_flag = flag

		return HTTP_STATUS_SUCCESS;
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
