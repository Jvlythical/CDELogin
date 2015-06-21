var app = angular.module('CDELogin', [])

app.directive('cdeLogin', ['CDEConstants', 'CDECache', function(CDEConstants, CDECache) {
	
	return {
		link : function(scope, element, attrs) {
			
			CDEConstants.bind(scope);

			scope.init({
				'loginCallback' : function() {
					 	scope.User.access_token = CDECache.get('access_token');
            scope.$apply();
				},
			});

			scope.$on('oauth', function() {
				console.log('OAuth');
			});

			scope.$on('cauth', function() {
				console.log('CAuth');
			});

			scope.$on('cstart', function() {
				console.log('CAuth');
			});

		}
	}

}]);

app.controller('CDELoginCtrl', ['$scope', 'CDESession', 'CDEControlBuffer',
function($scope, CDESession, CDEControlBuffer) {
			
		var Config;
			
    $scope.init = function(config) {
 				
				CDEControlBuffer.bind($scope);
				Config = config;

        // Callbacks are optional, used here for demo
        CDESession.init({
        	'Scope' : $scope,
					'init_callback' : function() {
							
						// Checks if the user has already logged in
						CDESession.autoLogin('#', function() {
							 if(Config.loginCallback !== undefined)
								Config.loginCallback();
						});

					}
        });
        
    }
    
    // Handles user click on login
    $scope.login = function() {
        
        // Callbacks are optional, used here for demo
      CDESession.login(function() {
				if(Config.loginCallback !== undefined)
					Config.loginCallback();
      }); 
       
    }
    
}]);
