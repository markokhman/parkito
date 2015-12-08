angular.module('dialog-controllers', ['firebase'])

.controller('DialogsCtrl', function($scope, $firebaseArray, CONST, $ionicLoading, AuthService, Session, $timeout, INFO, $rootScope, $state) {
	
	// $state.go($state.current, {}, {reload: true});
	// $rootScope.hideTabs = false;
	//Its the first controller to render so we login at this point
	if (window.localStorage.getItem(INFO.applicationNAME+"User") != null) {
	  Session.create(JSON.parse(window.localStorage.getItem(INFO.applicationNAME+"User")));
	  $scope.user = Session.user;
	  $ionicLoading.show({
	      template: 'Loading the beauty...'
	    });
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


	
	var chatsRef = new Firebase(CONST.fire).child("chatnames");
	var query = chatsRef.limitToLast(4);

	$scope.chats = $firebaseArray(query);
	$scope.chats.$loaded().then(function () {
		$ionicLoading.hide();
	});
})

.controller('DialogDetailCtrl', function($scope, $stateParams, $firebaseArray, CONST, $ionicLoading, $rootScope, $ionicModal, $ionicScrollDelegate) {
	
	// Loading spin
	$ionicLoading.show({
      template: 'Loading the beauty...'
    });

	// Acess the chat name and connect to reference with chatcontents
    $scope.name = $stateParams.name;
	var chatRef = new Firebase(CONST.fire).child("chatcontents/"+$stateParams.id);
	var query = chatRef.orderByChild("timestamp");
	
	$scope.messages = $firebaseArray(query);

	$scope.messages.$loaded().then(function () {
		$rootScope.hideTabs = true;
		$ionicScrollDelegate.scrollBottom();
		$ionicLoading.hide();
	});

	$scope.messages.$watch(function() { 
		$ionicScrollDelegate.scrollBottom();
	});

	// Post a parking spot
	$scope.postSpot = function () {
		var message = {
			mestype: "text",
			mestext: "trolololo",
			timestamp: Firebase.ServerValue.TIMESTAMP
		}
		$scope.messages.$add(message).then(function(ref) {
		    var id = ref.key();
		    $scope.messages[$scope.messages.$indexFor(id)].mesid = id;
		    $scope.messages.$save($scope.messages.$indexFor(id));
			$ionicScrollDelegate.scrollBottom();
		});
	}

	$ionicModal.fromTemplateUrl('templates/post-spot-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});
	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
	// Execute action
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
	// Execute action
	});

	// Post emoji
	$scope.postThanks = function () {
		var message = {
			mestype: "thanks",
			timestamp: Firebase.ServerValue.TIMESTAMP
		}
		$scope.messages.$add(message).then(function(ref) {
		    var id = ref.key();
		    $scope.messages[$scope.messages.$indexFor(id)].mesid = id;
		    $scope.messages.$save($scope.messages.$indexFor(id));
			$ionicScrollDelegate.scrollBottom();
		});
	}

	// $scope.postThanks();
});