
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
