angular.module('dialog-controllers', ['firebase','ngMap','angular-svg-round-progress'])

.controller('DialogsCtrl', function($scope, $firebaseArray, CONST, $ionicLoading, AuthService, Session, $timeout, INFO, $rootScope, $state, $ionicModal) {
	
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


	// Chats 
	var chatsRef = new Firebase(CONST.fire).child("chatnames");
	var query = chatsRef.limitToLast(4);

	$scope.chats = $firebaseArray(query);
	$scope.chats.$loaded().then(function () {
		$ionicLoading.hide();
	});

	// View map


	$scope.openModal = function() {
		$ionicModal.fromTemplateUrl('templates/viewmap.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
		
		$rootScope.closeModal = function() {
			$scope.modal.remove();
		};
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
	
})

.controller('DialogDetailCtrl', function($scope, $stateParams, $firebaseArray, CONST, $ionicLoading, $rootScope, $ionicModal, $ionicScrollDelegate, $ionicPopup) {
	
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

	// Triggered on a button click, or some other target
	$scope.takeSpot = function() {

		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
		    template: "",
		    title: 'Do you want to take this spot?',
		    subTitle: 'We will navigate You with WAZE app',
		    scope: $scope,
		    buttons: [
		      { text: '<i class="icon ion-arrow-left-c"></i>',
		      	onTap: function(e) {
		        	return false;
		        } 
		    	},
		      {
		        text: '<b>YES</b>',
		        type: 'button-positive',
		        onTap: function(e) {
	            	return true;
		        }
		      }
		    ]
		  });

		  myPopup.then(function(res) {
		  	if (res) {
		    	console.log('Redirected to WAZE!', res);
		    	// $rootScope.closeModal();
		  	};
		  });
	};

	$ionicModal.fromTemplateUrl('templates/post-spot.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function() {
		$scope.modal.show();
	};
	$rootScope.closeModal = function() {
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
})
.controller('ModalCtrl', function($scope, $rootScope, NgMap, $ionicPopup, $ionicModal, $timeout) {

	NgMap.getMap().then(function(map) {
		// current position
		var options = {
	      enableHighAccuracy: true,
	      timeout: 5000,
	      maximumAge: 0
	    };

	    // if allowed
	    function success(pos) {

	    	// created object to store address, coordinates and waiting time
		    $scope.spot = {}
			var crd = pos.coords;

			map.setCenter({lat: crd.latitude, lng: crd.longitude});
			map.setZoom(18);

			var geocoder = new google.maps.Geocoder;
 			var infowindow = new google.maps.InfoWindow;
		    
 			var coordinates = map.getCenter();
		    geocodeLatLng(geocoder, map, infowindow, coordinates);

		    map.addListener('dragend', function() {
			    coordinates = map.getCenter();
			    geocodeLatLng(geocoder, map, infowindow, coordinates);
			});

		    function geocodeLatLng(geocoder, map, infowindow, coordinates) {
			  var latlng = coordinates;
			  geocoder.geocode({'location': latlng}, function(results, status) {
			    if (status === google.maps.GeocoderStatus.OK) {
			      if (results[1]) {
			      	// console.log(results[0].formatted_address)
			        // $scope.address = results[0].formatted_address;
			        $scope.spot.formatted_address = results[0].formatted_address;
			        $scope.spot.coordinates = {lat: coordinates.lat(), lng: coordinates.lng()};

			        $scope.$apply();
			      } else {
			        console.log('No results found');
			      }
			    } else {
			      console.log('Geocoder failed due to: ' + status);
			    }
			  });
			}
	    }

	    // if not
	    function error(err) {
	      alert('ERROR(' + err.code + '): ' + err.message);
	    };

	    navigator.geolocation.getCurrentPosition(success, error, options);    

	});

	// Triggered on a button click, or some other target
	$scope.showPopup = function() {

		  $scope.spot.waitingtime = 5;
		  ""
		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
		    template: "<div class=\"list\"><div class=\"item item-text-wrap\" style=\"background-color: transparent; color: white;text-align: center;font-size: 20px;border: none; \">  {{spot.waitingtime}} min </div>  <div class=\"item range range-positive\">    <i class=\"icon ion-clock assertive\"></i>    <input ng-model=\"spot.waitingtime\" type=\"range\" min=\"0\" max=\"15\"> <i class=\"icon balanced ion-clock\"></i>  </div></div>",
		    title: 'How long you will wait?',
		    subTitle: 'Drag <i class="icon ion-arrow-left-c"></i><i class="icon ion-arrow-right-c"></i> to change',
		    scope: $scope,
		    buttons: [
		      { text: '<i class="icon ion-arrow-left-c"></i>',
		      	onTap: function(e) {
		        	return false;
		        } 
		    	},
		      {
		        text: '<b>Post</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		        	if ($scope.spot.waitingtime) {
		            	return $scope.spot;
		        	};
		        }
		      }
		    ]
		  });

		  myPopup.then(function(res) {
		  	if (res) {
		    	console.log('Pseudo Posted!', res);
		    	$rootScope.closeModal();
		  	};
		  });
	};

})
.controller('ViewmapCtrl', function ($scope, $rootScope, NgMap, $firebaseArray, CONST, $state, $ionicLoading) {
	// Loading spin
	$ionicLoading.show({
      template: 'Loading the beauty...'
    });

	NgMap.getMap().then(function(map) {
		// current position
		var options = {
	      enableHighAccuracy: true,
	      timeout: 5000,
	      maximumAge: 0
	    };

	    // if allowed
	    function success(pos) {

	    	var ref = new Firebase(CONST.fire);
	    	$scope.areas = $firebaseArray(ref.child('/chatcoords'));

	    	var colors = ['#1abc9c','#e74c3c','#9b59b6', '#bdc3c7', '#f39c12']

	    	// created object to store address, coordinates and waiting time
		    $scope.spot = {}
			var crd = pos.coords;

			map.setCenter({lat: crd.latitude, lng: crd.longitude});
			map.setZoom(13);

			var geocoder = new google.maps.Geocoder;
 			var infowindow = new google.maps.InfoWindow;
		    
 			var coordinates = map.getCenter();
		    geocodeLatLng(geocoder, map, infowindow, coordinates);
	        
	        $scope.areas.$loaded().then(function () {
		    		angular.forEach($scope.areas, function(area) {
					    // Add the circle for this city to the map.
					    var areaCircle = new google.maps.Circle({
					      strokeColor: '#FF0000',
					      strokeOpacity: 0.1,
					      strokeWeight: 1,
					      fillColor: colors[Math.floor(Math.random() * colors.length)],
					      fillOpacity: 0.35,
					      map: map,
					      center: {lat: area.coords.lat, lng: area.coords.lng},
					      radius: area.radius
					    });

					    var labelText = '<div style="color: #FFF">'+area.name+'</div>';

					    var myOptions = {
					        content: labelText,
					        boxStyle: {
					            background: '#000',
					            border: "1px solid white",
					            pixelOffset: new google.maps.Size(-45, 0),
					            textAlign: "center",
					            fontSize: "8pt",
					            opacity: 0.9,
					            width: "70px"
					        },
					        disableAutoPan: true,
					        pixelOffset: new google.maps.Size(-45, 0),
					        position: areaCircle.center,
					        closeBoxURL: "",
					        isHidden: false,
					        enableEventPropagation: true
					    };

					    var label = new InfoBox(myOptions);
					    label.open(map);

					    areaCircle.addListener('click', function() {
						    $state.go('tab.dialog-detail',{ id : area.$id, name: area.name})
					    	$rootScope.closeModal();
						});
			        });
					$ionicLoading.hide();
	        })

		    map.addListener('dragend', function() {
			    coordinates = map.getCenter();
			    geocodeLatLng(geocoder, map, infowindow, coordinates);
			});

		    function geocodeLatLng(geocoder, map, infowindow, coordinates) {
			  var latlng = coordinates;
			  geocoder.geocode({'location': latlng}, function(results, status) {
			    if (status === google.maps.GeocoderStatus.OK) {
			      if (results[1]) {
			      	// console.log(results[0].formatted_address)
			        // $scope.address = results[0].formatted_address;
			        $scope.spot.formatted_address = results[0].formatted_address;
			        $scope.spot.coordinates = {lat: coordinates.lat(), lng: coordinates.lng()};

			        $scope.$apply();
			      } else {
			        console.log('No results found');
			      }
			    } else {
			      console.log('Geocoder failed due to: ' + status);
			    }
			  });
			}
	    }

	    // if not
	    function error(err) {
	      console.log('ERROR(' + err.code + '): ' + err.message);
	    };

	    navigator.geolocation.getCurrentPosition(success, error, options);    

	});
});