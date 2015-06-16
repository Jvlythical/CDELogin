
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

// Frontend 
	var frontend_paths = {
		'new_file_template' : frontend_templates + '/new_file_template.html',
		'tooltip_template' : frontend_templates + '/tooltip_template.html',
		'file_nav_template' : frontend_templates + '/file_nav_template.html',
		
		'snapshots_mins_template' : frontend_templates + '/mins/snapshots_mins_template.html',
		'mins_router_template' : frontend_templates + '/mins/mins_router_template.html',
		'git_template' : frontend_templates + '/mins/git_template.html',
		'settings_template' : frontend_templates + '/mins/settings_template.html',

		'home_page_template' : frontend_templates + '/app/home_page_template.html',
		'about_template' : frontend_templates + '/app/about_template.html',
		
		'share_file_template' : frontend_templates + '/overlay/share_file_template.html',
		'import_file_template' : frontend_templates + '/overlay/import_file_template.html',
		'move_file_template' : frontend_templates + '/overlay/move_file_template.html',

		'search_file_template' : frontend_templates + '/IO/search_file_template.html',
		'run_output_template' : frontend_templates + '/IO/run_output_template.html',
		'messages_template' : frontend_templates + '/messages_template.html'
	};

// Backend
	var backend_paths = {
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
	var firebase_paths = {
		'firebase_root' : firebase_root
	}

// Map key to path
	return function(key) {
		if(backend_paths[key] != undefined) 
			return backend_paths[key];
		else if (frontend_paths[key] != undefined) 
			return frontend_paths[key];
		else if(firebase_paths[key] != undefined)
			return firebase_paths[key];
		else 
			return undefined;
	}

}]);
