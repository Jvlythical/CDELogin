app.factory('login', ['$rootScope', 'CDEPath', 'CDEWrite', 'CDEUtil', 'CDECache',
function($rootScope, get_path, CDEWrite, CDEUtil, CDECache) {

	return function(user_id, full_name, email, callback) {
		
		if(CDEUtil.getParameter('name').length != 0) {
			var container = CDEUtil.getParameter('name');

			sessionStorage.setItem('container', container);
			CDECache.put('container', container);
		}
			
		if(CDEUtil.getParameter('type').length != 0) {
			var type = CDEUtil.getParameter('type');
			
			sessionStorage.setItem('type', type);
			CDECache.put('type', type);
		}
			
		if(full_name === undefined) {

			CDECache.put('user_id', '');
			CDECache.put('access_token', '');

			localStorage.setItem('user_id', '');
			localStorage.setItem('access_token', '');
			
			$rootScope.$broadcast('cauth', {
				'uid' : '',
				'access_token'  : ''
			});

			if(callback !== undefined) 
				callback();

			return false;
		}

		var name_ar = full_name.split(' ');

		$.post(get_path('login_controller'), {
			'user_id' : user_id,
			'first_name' : name_ar[0],
			'last_name' : name_ar[name_ar.length - 1],
			'email' : email
		}, function(data) {
		
				sessionStorage.clear();
				
				CDECache.put('access_token', data.replace(/"/g, ''));
				CDECache.put('user_id', user_id);

				localStorage.setItem('access_token', data.replace(/"/g, ''));
				localStorage.setItem('user_id', user_id);

				$rootScope.$broadcast('cauth', {
					'uid' : user_id,
					'access_token'  : data.replace(/"/g, '')
				});

				if(callback !== undefined) 
					callback(data);

		});
	}

}]);
