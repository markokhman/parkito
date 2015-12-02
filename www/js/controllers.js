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
.controller('TabCtrl', function($scope, AuthService) {
  $scope.showProfilePopup = function () {
    AuthService.showProfilePopup();
  }
});
