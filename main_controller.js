app.controller('MainCtrl', ['$scope', 'CDE', 'CDECache', function($scope, CDE, CDECache) {

    $scope.User = {};
    
    $scope.init = function() {
        
        // Callbacks are optional, used here for demo
        CDE.init($scope, {
            'init_callback' : function() {
                
                // Checks if the user has already logged in
                CDE.checkLogin('#', function() {
                    $scope.User.access_token = CDECache.get('access_token');
                    $scope.$apply();
                });
            }
        })
        
    }
    
    // Handles user click on login
    $scope.login = function() {
        
        // Callbacks are optional, used here for demo
       CDE.login(function() {
            $scope.User.access_token = CDECache.get('access_token');
            $scope.$apply();
        }); 
       
    }
    
    $scope.init();
}])