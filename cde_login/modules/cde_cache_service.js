
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
