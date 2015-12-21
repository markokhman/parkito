angular.module('starter.controllers', ['auth'])

.controller('DashCtrl', function($scope, AuthService, Session, $timeout, INFO, $rootScope) {
 
 if (window.localStorage.getItem(INFO.applicationNAME+"User") != null) {
      Session.create(JSON.parse(window.localStorage.getItem(INFO.applicationNAME+"User")));
      $scope.user = Session.user;
  } else {
    console.log("No user found in cookies")
    AuthService.showLoginPopup();
  }

  $rootScope.$on('auth-login-success', function () {
    $scope.user = Session.user;
  });
  $rootScope.$on('auth-logout-success', function () {
    $scope.user = null;
    AuthService.showProfilePopup();
  });

  $scope.showProfilePopup = function () {
    AuthService.showProfilePopup();
  }
  $scope.showLoginPopup = function () {
    AuthService.showLoginPopup();
  }
  $scope.logout = function () {
    AuthService.logout();
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('TabCtrl', function($scope, AuthService, $state, AuthService, Session, $timeout, INFO, $rootScope) {
  
  $scope.showProfilePopup = function () {
    AuthService.showProfilePopup();
  }

})
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$watch(attributes.hideTabs, function(value){
                $rootScope.hideTabs = true;
            });
            scope.$on('$destroy', function() {
                $rootScope.hideTabs = true;
            });
        }
    };
});
