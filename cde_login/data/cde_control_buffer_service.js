app.factory('CDEControlBuffer', [function() {
	
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
