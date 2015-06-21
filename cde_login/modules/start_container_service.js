app.factory('start_container', ['CDEPath', 'CDEWrite', 'CDEUtil', function(CDEPath, CDEWrite, CDEUtil) {
	var terminal_id = 'terminal_iframe';

	return function(id, etag, email, callback) {
		var type = undefined
		var name = undefined;

		if(id == undefined) 
			id = "";

		if(etag == undefined) 
			etag = "";

		if(email == undefined) 
			email = "";

		if(CDEUtil.getParameter('type') !== "") 
			type = CDEUtil.getParameter('type');
			
		if(CDEUtil.getParameter('name') !== "") 
			name = CDEUtil.getParameter('name');

		if(type !== undefined && name !== undefined) {
			var parameters = {
				'id' : id,
				'etag' : etag,
				'email' : email,
				'type' : type,
				'name' : name
			}
		} else {
			var parameters = {
				'id' : id,
				'etag' : etag,
				'email' : email
			}
		}

		$.post(CDEPath('start_container'), parameters, function(data) {
		
			if(callback != undefined) 
				callback(data);

		});

	}
}]);
