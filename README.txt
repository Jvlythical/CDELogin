USAGE:
	1. Inject CDELogin into your module
	2. Bind cde-login to a view element 
	3. Bind CDELoginCtrl to that same element
	4. Bind ng-click="login()" to some click-able element

	(Example shown in driver.html)

EVENTS:

	*** oauth ***
		Broadcasted after user authenticates with omniauth	
			~ Upon success, passes in the object data = {
					'name' : name,
					'email' : email,
					'image' : image
				}

	*** cauth ***
		Broadcaster after user authenticates with CDE backend
			~ Upon success, passes in the object data = {
				'uid' : user_id,
				'access_token' : access_token
			}

	*** cstart ***
		Broadcaster after container starts
			~ Upon success, passes in the object data = {
				'name' : container_name,
				'user' : owner
				'group' : 'users_with_access_to_container',
				'permission' : 'container accessibility',
			}
