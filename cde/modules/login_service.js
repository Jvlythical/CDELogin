app.factory('login', ['$rootScope', 'CDEPath', 'CDEWrite', 'CDEUtil', 'CDECache',
function($rootScope, CDEPath, CDEWrite, CDEUtil, CDECache) {

	return function(user_id, full_name, email, callback) {
		var name_ar = full_name.split(' ');
		var first_name = name_ar[0];
		var last_name = name_ar[name_ar.length - 1];

		$.post(CDEPath('login_controller'), {
			'user_id' : user_id,
			'first_name' : first_name,
			'last_name' : last_name,
			'email' : email
		}, function(data) {
			if(CDEUtil.getParameter('name') !== "") 
				var container = CDEUtil.getParameter('name');
			
			if(CDEUtil.getParameter('type') !== "") 
				var type = CDEUtil.getParameter('type');
			
			try {
				sessionStorage.clear();
				
			// "Session" data initialization
				CDECache.put('access_token', data.replace(/"/g, ''));
				CDECache.put('user_id', user_id);

				localStorage.setItem('access_token', data.replace(/"/g, ''));
				localStorage.setItem('user_id', user_id);
				
				$rootScope.$broadcast('verified', {
					'uid' : user_id,
					'access_token' : data.replace(/"/g, '')
				});
				
				if(container != undefined) 
					sessionStorage.setItem('container', container);
				
				if(type != undefined) 
					sessionStorage.setItem('type', type);
				
				if(callback != undefined) 
					callback(data);
				
				$rootScope.$broadcast('authenticated');

			} catch(err) {
				console.log(err)
				var msg = 'An error has occurred with setting user access_token';
				CDEWrite(msg, 'console', 'login => ');
			}
		});
	}

}]);
