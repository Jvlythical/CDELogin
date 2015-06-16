
'use strict;'

app.factory('CDEFirebase', ['$rootScope', 'CDEWrite', 
function($rootScope, CDEWrite) {
	
	var FBPath = 'https://resplendent-heat-459.FireBaseio.com/';

	var FBWRAPPER_STATUS_SUCCESS = true;
	var FBWRAPPER_STATUS_FAILURE = false;

// *** PUBLIC ***

/* ------------------------------------------------
 *   Initializes FB references relevant to app
 *    ~ Defines FB model passed by caller
 *   	~ Creates a reference for each key
 *   	~ Attaches listeners to the references
 * ------------------------------------------------
 */
	
	var init = function(Container) {
		
		if(Container === undefined)
			return FBWRAPPER_STATUS_FAILURE;

		// Firebase Control Buffer
		scope.FireBase = {
			'permission' : undefined,
			'collaborators' : undefined,
			'new_file_data' : undefined
		};	

		// Create FB refs
		for(var key in FBModel) {

			var ref_path = FBPath + Container.name + '/' + key;
			
			FBModel[key] = new Firebase(ref_path);
		}
		
		attachListeners(Container);
	
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

/* ---------------------------------------------------
 *   Listens to when Container permissions change 
 *    ~ Check if data is valid
 *   	~ Announce that permissions has changed
 * ---------------------------------------------------
 */

	var handlePermissionChange = function(snapshot) {
	
		if(snapshot.val() === null)
			return undefined;

		return snapshot.val();
	}

/* ------------------------------------------------
 *   Re-evaluates the Container's group members
 *   	~ Get data from firebase
 *   	~ Push members into an array
 *   	~ Announce that group has changed
 * ------------------------------------------------
 */

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

	var attachListeners = function(Container) {
		
		FBModel.permission.on('value', function(snapshot) {
			Container.permission = handlePermissionChange(snapshot);
			$rootScope.$broadcast('settings.ready');
		});

		FBModel.collaborators.on('value', function(snapshot) {
			Container.group = handleGroupChange(snapshot);

			$rootScope.$broadcast('settings.new_collaborator', snapshot);
		});

		FBModel.new_file_data.on('value', function(snapshot) {
			var data = snapshot.val();

			$rootScope.$broadcast('fnav.new_data', data);
		});
	}

/* -----------------------------------
 *   Expose FB Wrapper public API
 *   	~ returns an object 
 * -----------------------------------
 */ 

	return {
		init : init,
		copy : copy,
		move : move
	}

}]);
