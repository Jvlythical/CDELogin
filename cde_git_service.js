
'use strict;'

app.factory('CDEGit', ['CDEWrite', 'CDEPath', 'CDEUtil', 'CDEHttp', 
function(CDEWrite, CDEPath, CDEUtil, CDEHttp) {
	
	var GIT_STATUS_FAILURE = false;
	var GIT_STATUS_SUCCESS = true;

	var Scope = undefined;
	var Config = undefined;
	var Statuses = {};

// *** PUBLIC ***

	var init = function(config) {
		
		if(typeof(config) !== 'object')
			return GIT_STATUS_FAILURE;
		
		if(config.debug_flag) 
			CDEHttp.setDebugMode(true);
		
		Config = config;
		Statuses.init = true;
	}

	var checkout = function(file_path, version, callback) {

		var fid = 'Git_checkout => ';
		var key = CDEPath('git_checkout');
		var url = CDEHttp.GetRequest(key);
		var args_set = CDEUtil.argsNotUndefined(arguments, 2);

		if(url === '') 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			url = CDEHttp.mergePath(url, {
				'file_path' : file_path,
				'version' : version
			});

			CDEHttp.sendGetRequest(fid, url, callback);
		}

		return GIT_STATUS_SUCCESS;
	}

	var commit = function(file_path, message, callback) {

		var fid = 'Git_commit => ';
		var key = CDEPath('git_commit');
		var url = CDEHttp.GetRequest(key);
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(url === '') 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			url = CDEHttp.mergePath(url, {
				'file_path' : file_path,
				'message' : (message === undefined ? '' : message) 
			});

			CDEHttp.sendGetRequest(fid, url, callback);
			
		}

		return GIT_STATUS_SUCCESS;
	}

	var diff = function(file_path, callback) {
	
		var fid = 'Git_diff => ';
		var key = CDEPath('git_diff');
		var url = CDEHttp.GetRequest(key);
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

		return GIT_STATUS_SUCCESS;
	}

	var log = function(file_path, callback) {
		
		var fid = 'Git_log => ';
		var key = CDEPath('git_log');
		var url = CDEHttp.GetRequest(key);
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

		return GIT_STATUS_SUCCESS;
	}

	var pull = function(git_repo, callback) {

		var fid = 'Git_pull => ';
		var key = CDEPath('git_pull');
		var url = CDEHttp.GetRequest(key);
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(url === '') 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			url = CDEHttp.mergePath(url, {
				'git_repo' : git_repo
			});

			CDEHttp.sendPostRequest(fid, url, callback);
		}

		return GIT_STATUS_SUCCESS;
	}

	var push = function(git_repo, callback) {
		
		var fid = 'Git_push => ';
		var key = CDEPath('git_push');
		var url = CDEHttp.GetRequest(key);
		var args_set = CDEUtil.argsNotUndefined(arguments, 1);

		if(url === '') 
			return InvalidCredentials(fid);
		else if(!args_set)
			return InvalidArguments(fid);
		else {

			url = CDEHttp.mergePath(url, {
				'git_repo' : git_repo
			});

			CDEHttp.sendPostRequest(fid, url, callback);
		}

		return GIT_STATUS_SUCCESS;
	}

// *** PRIVATE ***

	var InvalidCredentials = function(fid) {

		var err = 'User credentials are not set!';
		CDEWrite(err, 'console', fid);

		return GIT_STATUS_FAILURE;
	}

	var InvalidArguments = function(fid) {

		var err = 'Invalid arguments!';
		CDEWrite(err, 'console', fid);

		return GIT_STATUS_FAILURE;
	}

	var parse = function(git_data) {

		var tok_ar = git_data.split(/commit \w*?\nAuthor/)
		var ele = '';
		var version = 0;
		var error_msg = '<div style="padding:10px; background:rgb(240,240,240);">No snapshots to display</div>'

		if(tok_ar.length == 1 && tok_ar[0] == '') return error_msg; 
		if(tok_ar.length == 1 && tok_ar[0] == 'An error has occurred in diffing the file :(') return error_msg; 

		for(var i in tok_ar) {
			if(tok_ar[i] == '') continue;
			
			var sub_tok = tok_ar[i].split("\n");
			var add_ar = [];
			var delete_ar = [];
				
			ele = ele + '<div ng-controller="Git" style="border-top:1px dotted lightgrey; padding:10px 0;" >';

			for(var n in sub_tok) {
				var tok = sub_tok[n];

				if(n == 1) {
					var d = new Date(tok);
					var n = new Date();
					var time_diff = n.getTime() - d.getTime();
					var btn_style = 'btn btn-info';

					if(time_diff < 900000) btn_style = 'btn btn-warning';
					if(time_diff < 60000) btn_style = 'btn btn-danger';

					var button = '<button class="' + btn_style + ' git-checkout" version="'+ version +'" style="border-radius:1px;">' 
						+ d.toLocaleTimeString() + ' ' + d.toDateString() + '</button>'; 
					ele = ele + button;
				}	
				if(tok[0] == '+') add_ar.push(tok);
				if(tok[0] == '-') delete_ar.push(tok);

			}
			
			ele = ele + '<div style="background:rgb(248,248,248); padding:5px; margin:10px 0; border-radius:1px;">';
			for(var j in add_ar) {
				ele = ele + add_ar[j] + '\n';
			}
			ele = ele + '</div>';

			for(var k in delete_ar) {
				ele = ele + delete_ar[k] + '\n';
			}

			ele = ele + '</div>';
			version++;
		}
	
		return ele;
	}

	var parseLog = function(data) {

		var tok = data.split('\n');
		var el = '', n = 0;

		for(var i in tok) {
								
			if(i % 6 == 0) {
				if(tok[n].substring(0, 6) !== 'commit') {
					continue;
				}

				el = el + '<div class="commit_block">';
				el = el + '<button class="btn btn-primary" ng-click="gitCheckout(event)">';
			}
			
			if(i % 6 == 1) el = el + '<pre>'
			if(i % 6 == 0) el = el + tok[n].replace('commit', '');
			else el = el + tok[n] + '\n';

			if(i % 6 == 0) el = el + '</button>';
			if(i % 6 == 5) el = el + '</pre></div>';
			
			n++;
		}
		
		return el;
	}

	return {
		'init' : init,
		'checkout' : checkout,
		'commit' : commit, 
		'diff' : diff,
		'log' : log,
		'pull' : pull,
		'push' : push,
		'parse' : parse,
		'parseLog' : parseLog
	}

}]);
