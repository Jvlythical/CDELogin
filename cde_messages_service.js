
'use strict;'

app.factory('CDEMessages', ['CDEWrite', 'CDEHttp', 'CDEPath', 
function(CDEWrite, CDEHttp, CDEPath) {

// Constants
	var MESSAGES_STATUS_SUCCESS = true;
	var MESSAGES_STATUS_FAILURE = false;

// Members
	var Scope = undefined;
	var Statuses = {};

// Constructor
	var init = function(config) {
			
		if(typeof(config) !== 'object')
			return MESSAGES_STATUS_FAILURE;
		
		Scope = (config.Scope === undefined ? {} : config.Scope);
		Statuses.init = true;
	}

// *** PUBLIC ***

	var getReceivedMessages = function(callback) {
		
		var fid = 'Get_received_messages => ';
		var url = CDEHttp.GetRequest(CDEPath('get_received_messages'));
		
		if(!url.length)
			return InvalidCredentials(fid);
		else {
			
			CDEHttp.sendGetRequest(fid, url, callback);

		}
		
		return MESSAGES_STATUS_SUCCESS;
	}

	var getSentMessages = function(callback) {
		
		var fid = 'Get_sent_messages => ';
		var url = CDEHttp.GetRequest(CDEPath('get_sent_messages'));
		
		if(!url.length)
			return InvalidCredentials(fid);
		else {
			
			CDEHttp.sendGetRequest(fid, url, callback);

		}

		return MESSAGES_STATUS_SUCCESS;
	}

	var sendMessage = function(recipient, subject, message, link, callback) {
		
		if(recipient === undefined || link === undefined)
			return MESSAGES_STATUS_FAILURE;
		
		var fid = 'Change_permission => ';
		var params = CDEHttp.PostParams();
		var url = CDEPath('send_message');

		if(params === undefined)
			return InvalidCredentials(fid);
		else {
		
			CDEHttp.mergeParams(params, {
				'subject' : subject,
				'recipient' : recipient,
				'message' : message,
				'link' : link
			});

			CDEHttp.sendPostRequest(fid, url, params, callback);
			
			return MESSAGES_STATUS_SUCCESS;
		}
			

	}

// *** PRIVATE ***

	var InvalidArguments = function(fid) {

		var err = 'Invalid arguments!';
		CDEWrite(err, 'alert', fid);

		return MESSAGES_STATUS_FAILURE;
	}

	var InvalidCredentials = function(func_id) {

		var err = 'User credentails are not set!';
		CDEWrite(err, 'console', func_id);
		
		return MESSAGES_STATUS_FAILURE;
	}

/* -----------------------------
 *   Application public API
 *   	~ Returns an objcet
 * -----------------------------
 */

	return {
		'init' : init,
		'getReceived' : getReceivedMessages,
		'getSent' : getSentMessages,
		'send' : sendMessage
	}

}]);
