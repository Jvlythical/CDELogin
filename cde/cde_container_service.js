
'use strict;'

app.factory('CDEContainer', ['CDEWrite', 'CDEPath', 'CDECache', 'CDEUtil', 'CDEHttp',
function(CDEWrite, CDEPath, CDECache, CDEUtil, CDEHttp) {
	
// Constants
	var CONTAINER_STATUS_SUCCESS = true;
	var CONTAINER_STATUS_FAILURE = false;
	
// Members
	var Config = undefined;
	var Statuses = {};

// Constructor
	var init = function(config) {
			
		if(typeof(config) !== 'object')
			return CONTAINER_STATUS_FAILURE;

		if(config.debug_flag) 
			CDEHttp.setDebugMode(true);

		Config = config;
		Statuses.init = true;
	}

// API Implementations
	var addMember = function(email, cname, callback) {

		var fid = 'Add_container_member => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('add_container_member');
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			CDEHttp.mergeParams(params, {
				'email' : email,
				'container_name' : cname
			});
			
			CDEHttp.sendPostRequest(fid, url, params, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
	}
	
 	var getFileContent = function(file_path, callback) {

		var fid = 'Container_file_content => ';
		var url = CDEHttp.GetRequest(CDEPath('container_file_content'));
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(url === '') 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {
			
			url = CDEHttp.mergePath(url, {
				'file_path' : file_path
			});

			CDEHttp.sendGetRequest(fid, url, callback);
			
		}
		
		return CONTAINER_STATUS_SUCCESS;
 	}

	var changePermission = function(user_uid, permission, cname, callback) {
		
		var fid = 'Change_permission => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('container_permission');
		var args_set = CDEUtil.argsNotUndefined(arguments, 3);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {
			
			CDEHttp.mergeParams(params, {
				'permission' : permission,
				'container_name' : cname
			});
			
			CDEHttp.sendPostRequest(fid, url, params, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
	}

 	var copyFile = function(dest, src, callback) {

		var fid = 'Container file copy => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('copy_container_file');
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {
		
			CDEHttp.mergeParams(params, {
				'target' : src,
				'destination' : dest
			});

			CDEHttp.sendPostRequest(fid, url, params, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
 	}

	var createFile = function(destination, file_type, callback) {

		var fid = 'Create_container_file => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('create_container_file');
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		if(params === undefined) 	
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {
		
			CDEHttp.mergeParams(params, {
				'destination' : destination,
				'file_type' : file_type
			})
		
			CDEHttp.sendPostRequest(fid, url, params, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
	}

	var createProject = function(dest, callback) {

		var fid = 'Create_container_project => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('create_container_project');
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {
			
			CDEHttp.mergeParams(params, {
				'destination' : dest
			});

			CDEHttp.sendPostRequest(fid, url, params, callback);

		}
		
		return CONTAINER_STATUS_SUCCESS;
	}
	
	var deleteFile = function(file_path, callback) {

		var fid = 'Delete_container_file => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('delete_container_file');
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if (!args_set)
			return InvalidArguments(fid);
		else {
			
			CDEHttp.mergeParams(params, {
				'file_path' : file_path
			});

			CDEHttp.sendPostRequest(fid, url, params, callback);
		}

		return CONTAINER_STATUS_SUCCESS;
	}

	var downloadFile = function(file_path, file_type, callback) {

		var fid = 'Download_container_file => ';
		var dl_url = CDEHttp.GetRequest(CDEPath('download_container_file'));
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(dl_url === '') 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {
				
			dl_url = CDEHttp.mergePath(dl_url, {
				'file_path' : file_path,
				'file_type' : file_type
			});

			if(callback != undefined) 
				callback(dl_url);
			
		}
	
		return CONTAINER_STATUS_SUCCESS;
	}

	var fork = function(cname, callback) {

		var fid = 'Fork container => ';	
		var params = CDEHttp.PostParams();
		var url = CDEPath('fork_container');
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			CDEHttp.mergeParams(params, {
				'container_name' : cname
			});

			CDEHttp.sendPostRequest(fid, url, params, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
	}

	var getFiles = function(random_flag, callback) {

		var fid = 'Get_container_files => ';
		var url = CDEHttp.GetRequest(CDEPath('user_container_files'));
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(url === '') 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {
			
			url = CDEHttp.mergePath(url, {
				'random' : random_flag
			});
			
			CDEHttp.sendGetRequest(fid, url, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
	}

	var insertFile = function(dest, file_ar, callback) {
		
		var fid = 'Insert_container_file => ';
		var url = CDEPath('insert_container_file');
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		for(var i in file_ar) {
			var params = CDEHttp.PostParams();
	
			if(params === undefined) 
				return InvalidCredentials(fid);
			else if(!args_set)
				return InvalidArguments(fid);
			else {
				
				CDEHttp.mergeParams(params, {
					'destination' : dest,
					'file_name' : file_ar[i].name,
					'file_content' : file_ar[i].data
				});
				
				CDEHttp.sendPostRequest(fid, url, params, callback);

			}
		}

		return CONTAINER_STATUS_SUCCESS;
	}

	var moveFile = function(src, dest, callback) {
		
		var fid = 'Move_container_file => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('move_container_file');
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			CDEHttp.mergeParams(params, {
				'destination' : dest,
				'target' : src
			});

			CDEHttp.sendPostRequest(fid, url, params, callback);

		}
		
		return CONTAINER_STATUS_SUCCESS;
	}
	
	var renameFile = function(file_path, file_name, callback) {

		var fid = 'Rename_container_file => ';
		var params = CDEHttp.PostParams(file_path, file_name);
		var url = CDEPath('rename_container_file');
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			CDEHttp.mergeParams(params, {
				'file_path' : file_path,
				'file_name' : file_name
			});
			
			CDEHttp.sendPostRequest(fid, url, params, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
	}

/* ----------------------------------------------
 *   Runs a user file specified by file_path
 *   	~ Runs the specified file
 *   	~ Tracks user actions
 * -----------------------------------------------
 */

	var runFile = function(file_path, user_actions, callback) {
		
		var fid = 'Compile_container_file => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('compile_controller');
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {
			
			CDEHttp.mergeParams(params, {
				'file_path' : file_path,
				'action_json' : JSON.stringify(user_actions)
			});

			CDEHttp.sendPostRequest(fid, url, params, callback);

		}
		
		return CONTAINER_STATUS_SUCCESS;
	}
	
	var share = function(file_path) {

		var fid = 'Share_container_file => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('share_container_file');
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);
		
		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			CDEHttp.mergeParams(params, {
				'file_rel_path' : file_path
			});
			
			CDEHttp.sendPostRequest(fid, url, params, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
	}

	var stop = function(callback) {
	
		var fid = 'Stop_container_service => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('stop_container');

		if(params === undefined) 
			return InvalidCredentials(fid);
		else {
			
			CDEHttp.sendPostRequest(fid, url, params, callback);

		}

		return CONTAINER_STATUS_SUCCESS;
	}
		
	var updateFile = function(file_path, file_content, callback) {

		var fid = 'Update_container_file => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('update_container_file');
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		if(params === undefined) 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			CDEHttp.mergeParams(params, {
				'file_path' : file_path,
				'file_content' : window.btoa(unescape(encodeURIComponent(file_content)))
			});

			CDEHttp.sendPostRequest(fid, url, params, callback);

		}
		
		return CONTAINER_STATUS_SUCCESS;
	}

	var verifyFile = function(action, user_credentials, temp_container, notify) {

		var actions = {
			'read' : 4,
			'write' : 2,
			'execute' : 1
		}
		
		if(CDEUtil.getParameter('p'))
			return true;
		
		for(var key in temp_container)
			if(temp_container[key] === undefined)
				return true;

		var permission = temp_container.permission;
		var user_id = user_credentials.user_id;
		var owner = temp_container.user;
		var group = temp_container.group;
		var mask = actions[action];
		var user_email = user_credentials.email;

		// Check World
		if((permission % 10 & mask) === mask)
			return true;
		
		// Check group
		for(var i in group) {
			if(group[i].email === undefined)
				continue;

			if(group[i].email === user_email) {
				if( (Math.floor(permission / 10) % 10 & mask) === mask) 
					return true;
			}
		}
		
		// Check user
		if(user_id === owner)
			return true;
		
		if(notify === undefined )
			alert('You do not have ' + action + ' permission :(');
		
		return false;
	}

// *** PRIVATE ***

	var ContainerError = function(key) {
		
		var msgs = {
			'INVALID_PARAM' : 'Please refresh the page or try again later.',
			'INVALID_CREDENTIALS' :'User credentials are not set!' 
		}

		return msgs[key];
	}

	var InvalidArguments = function(fid) {

		var err = 'Invalid arguments!';
		CDEWrite(err, 'alert', fid);

		return CONTAINER_STATUS_FAILURE;
	}

	var InvalidCredentials = function(func_id) {

		var err = ContainerError('INVALID_CREDENTIALS');
		CDEWrite(err, 'console', func_id);
		
		return CONTAINER_STATUS_FAILURE;
	}

/* -----------------------------
 *   Application public API
 *   	~ Returns an objcet
 * -----------------------------
 */

	return {
		'init' : init,
		'useradd' : addMember,
		'run' : runFile,
		'cat' : getFileContent,
		'chmod' : changePermission,
		'cp' : copyFile,
		'touch' : createFile,
		'mkdir' : createProject,
		'rm' : deleteFile,
		'dl' : downloadFile,
		'fork' : fork,
		'ls' : getFiles,
		'ftp' : insertFile,
		'mv' : moveFile,
		'rename' : renameFile,
		'share' : share,
		'exit' : stop,
		'write' : updateFile,
		'verify' : verifyFile
	}

}]);
