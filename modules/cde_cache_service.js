
/* ----------------------------------------------
 *   Injectable service for global caching 
 *   	~ Returns a cache with key ''CDECache'
 * ----------------------------------------------
 */

'use strict;'

app.factory('CDECache', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('CDECache');
}]);
