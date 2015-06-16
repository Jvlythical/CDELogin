
'use strict';

app.factory('Firepad', ['CDEPath', 'CDEUtil', 'CDEWrite',
function(CDEPath, CDEUtil, CDEWrite) {
	
	var init = function() {

	}

	var create = function(tab) {
		var namespace = 'firepad';
		var c_name = CDEUtil.getParameter('name');
		var err_msg = 'Credentials not met.';
		var service_tag = 'New_firepad_service => ';
		var file_key = tab.file_id;
		
		// Check if container is non-user
		if(c_name === '' || file_key === undefined) {
			CDEWrite(err_msg, 'console', service_tag);
			return undefined;
		}

		// Clean up firepad and ace
		try {
			if(firepad !== undefined)
				firepad.dispose();
		} catch(err) {

		}

		if(editor !== undefined)
			editor.setValue('');
		
		// Initialize new firepad instance
		var fb_root = CDEPath('firebase_root');
		var fb_parent = fb_root + '/' + c_name + '/' + namespace; 
		var ref = new Firebase(fb_parent + '/' + file_key);
		
		firepad	= Firepad.fromACE(ref, editor);
		
		firepad.on('ready', function() {
			if(firepad.isHistoryEmpty()) {
				firepad.setText(tab.file_contents);
			}
		})
				
		return ref;

	}

	var destroy = function(file_key) {
		var namespace = 'firepad';
		var c_name = CDEUtil.getParameter('name');
		var err_msg = 'Credentials not met.';
		
		// Check if container is non-user
		if(c_name === '') {
			CDEWrite(err_msg, 'console', 'New_firepad_service => ');
			return undefined;
		}

		var fb_parent = CDEPath('firebase_root') + '/' + c_name + '/' + namespace; 

		var ref = new Firebase(fb_parent + '/' + file_key);
		var s = ref.remove();
	}

	return {
		'init' : init,
		'create' : create,
		'destroy' : destroy
	}

}]);
