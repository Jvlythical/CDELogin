
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
