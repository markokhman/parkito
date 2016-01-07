angular.module('dialog-controllers', ['firebase','ngMap','angular-svg-round-progress'])

.controller('DialogsCtrl', function($scope, $firebaseArray, CONST, AuthService, Session, $timeout, INFO, $rootScope, $ionicPopup, $state, $ionicModal, $ionicPlatform) {
	Ionic.io();

	var push = new Ionic.Push({
	  "debug": false,
	  "onNotification": function(notification) {
	    var payload = notification.payload;
	    console.log(notification, payload);
	    var alertPopup = $ionicPopup.alert({
	     	title: 'New spot available',
	     	template: 'New spot on '+notification.text+' Your area!'
	   	});
	  },
	  "onRegister": function(data) {
	    console.log(data.token);
	  },
	  "pluginConfig": {
	    "ios": {
	      "badge": true,
	      "sound": true
	     },
	     "android": {
	       "iconColor": "#343434"
	     }
	  } 
	});
	
	// if (navigator.connection) {
	// 		console.log(navigator.connection.type)
	// 	if (navigator.connection.type=='Connection.NONE') {
	// 		console.log("no connection")
	// 	}
	// }

	$rootScope.$on('offline', function () {
		var alertPopup = $ionicPopup.alert({
	     	title: 'Your device is offline!',
	     	template: 'You will not be able to post or take parking spots while offline. Please connect to the Internet'
	   	});
	   	$scope.offline = true;
	})
	$rootScope.$on('online', function () {
	   	$scope.offline = false;
	})

	//Its the first controller to render so we login at this point
	if (window.localStorage.getItem(INFO.applicationNAME+"User") != null) {
		// AuthService.hideLoginPopup();
	  	
	  	Session.create(JSON.parse(window.localStorage.getItem(INFO.applicationNAME+"User")));
	  	$scope.user = Session.user;
	  	// $ionicLoading.show({
	   //    	template: 'Loading the beauty...'
	   //  });

	  	// Loading existing user into Current

	  	var success = function(loadedUser) {
		  	Ionic.User.current(loadedUser);
		  	Session.ionicUser = Ionic.User.current();

		  	var pushCallback = function(pushToken) {
			  	console.log('Registered token:', pushToken.token);
			  	Session.ionicUser.addPushToken(pushToken);
			  	Session.ionicUser.save(); // you NEED to call a save after you add the token
			}

			push.register(pushCallback);


		};

		var failure = function(error) {
		  	Session.ionicUser = new Ionic.User();
		  	Session.ionicUser.id = Session.user.uid;
		  	if (Session.user.profileImageURL) {
		  		Session.ionicUser.set('image', Session.user.profileImageURL);
		  	}
		  	if (Session.user.displayName) {
		  		Session.ionicUser.set('name', Session.user.displayName);
		  	}
			
			Session.ionicUser.save();
		  	
		  	var pushCallback = function(pushToken) {
			  	console.log('Registered token:', pushToken.token);
			  	Session.ionicUser.addPushToken(pushToken);
			  	Session.ionicUser.save(); // you NEED to call a save after you add the token
			}

			push.register(pushCallback);
		};

		Ionic.User.load(Session.user.uid).then(success, failure);

		if (!$scope.user.defaultChatId) {
			$ionicModal.fromTemplateUrl('templates/viewmap.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.areasMode = true;
				$scope.modal = modal;
				$scope.modal.show();
			});
			
			$rootScope.closeModal = function() {
				$scope.modal.remove();
			};
		} else {
			console.log("Redirect to defaultChat");
		}


	} else {
	     
		console.log("No user found in cookies. Create anonimous Ionic user")

		AuthService.showLoginPopup();
	}

	$rootScope.$on('auth-login-success', function () {
		$scope.user = Session.user;
		var ionicUser;

		var success = function(loadedUser) {
		  	Ionic.User.current(loadedUser);
		  	Session.ionicUser = Ionic.User.current();
		  	var pushCallback = function(pushToken) {
			  	console.log('Registered token:', pushToken.token);
			  	Session.ionicUser.addPushToken(pushToken);
			  	Session.ionicUser.save(); // you NEED to call a save after you add the token
			}

			push.register(pushCallback);

		};

		var failure = function(error) {
		  	Session.ionicUser = new Ionic.User();
		  	Session.ionicUser.id = Session.user.uid;
		  	if (Session.user.profileImageURL) {
		  		Session.ionicUser.set('image', Session.user.profileImageURL);
		  	}
		  	if (Session.user.displayName) {
		  		Session.ionicUser.set('name', Session.user.displayName);
		  	}
			Session.ionicUser.save();

			var pushCallback = function(pushToken) {
			  	console.log('Registered token:', pushToken.token);
			  	Session.ionicUser.addPushToken(pushToken);
			  	Session.ionicUser.save(); // you NEED to call a save after you add the token
			}

			push.register(pushCallback);
		};

		Ionic.User.load(Session.user.uid).then(success, failure);

		if (!$scope.user.defaultChatId) {
			$ionicModal.fromTemplateUrl('templates/viewmap.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.areasMode = true;
				$scope.modal = modal;
				$scope.modal.show();
			});
			
			$rootScope.closeModal = function() {
				$scope.modal.remove();
			};
		} else {
			console.log("Redirect to defaultChat");
		}

		// Loading existing user into Current

		
	  	

		AuthService.hideLoginPopup();

	});
	$rootScope.$on('auth-logout-success', function () {
		$scope.user = null;
		if (Session.ionicUser && Session.ionicUser.profileImageURL) {
	  		Session.ionicUser.unset('image');
	  	}
	  	if (Session.ionicUser && Session.ionicUser.displayName) {
	  		Session.ionicUser.unset('name');
	  	}

		AuthService.showLoginPopup();
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

	// if (!$scope.user.defaultChatId) {})



	// Chats 
	// var chatsRef = new Firebase(CONST.fire).child("chatnames");
	// var query = chatsRef.limitToLast(4);

	// $scope.chats = $firebaseArray(query);
	// $scope.chats.$loaded().then(function () {
	// 	$ionicLoading.hide();
	// });

	// View map


	$scope.openModal = function() {
		$ionicModal.fromTemplateUrl('templates/viewmap.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.areasMode = false;
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
		// console.log()
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
	// Execute action
	});

	$scope.postSpot = function() {
		if (!$scope.offline) {
	    	$state.go('tab.dialog-post');
		}
	}

	$scope.findspot = function  () {
		if (!$scope.offline) {
		    $state.go('tab.dialog-detail',{ id : Session.user.defaultChatId, name: Session.user.defaultChatName});
		}
	}
	
})

.controller('DialogDetailCtrl', function($scope, $window, $stateParams, $firebaseArray, $http, CONST, $ionicLoading, AuthService, $rootScope, $ionicModal, $state, Session, $ionicScrollDelegate, $ionicPopup, AuthService) {

	var deploy = new Ionic.Deploy();

	$scope.showProfilePopup = function () {
		AuthService.showProfilePopup();
	}
	$scope.showLoginPopup = function () {
		AuthService.showLoginPopup();
	}
	$scope.logout = function () {
		AuthService.logout();
	}

	// Loading spin
	$ionicLoading.show({
      template: 'Loading the beauty...'
    });

	// Acess the chat name and connect to reference with chatcontents
    $scope.name = $stateParams.name;
    $scope.chatid = $stateParams.id;
    $scope.timeNow = new Date().getTime();
    $scope.currentTime = new Date().getTime();
    console.log($scope.currentTime)

    if (Session.user) {
    	$scope.user = Session.user;
    }


	var chatRef = new Firebase(CONST.fire).child("chatcontents/"+$scope.chatid);
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

	// Triggered on a button click, or some other target
	$scope.takeSpot = function(spot) {

		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
		    template: "",
		    title: 'Do you want to take this spot on '+spot.formatted_address+'?',
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
		  		spot.taken = true;
		  		$scope.messages.$save($scope.messages.$indexFor(spot.$id));
		    	console.log('Redirected to WAZE!', res);

				var storyRef = new Firebase(CONST.fire).child("userstory/"+Session.user.uid);
				var recentSpot = storyRef.push();
				recentSpot.set({
					id : spot.$id,
					name : spot.name,
					posted : false
				});
				
		    	window.open("waze://?ll="+spot.coordinates.lat+","+spot.coordinates.lng+"&navigate=yes", "_system");
		  	};
		  });
	};


	$scope.openModal = function() {
		$ionicModal.fromTemplateUrl('templates/post-spot.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$rootScope.closeModal = function() {
				$scope.modal.hide();
			};
			$scope.modal.show();
		});
	};

	$scope.toogleNotifications = function () {
		if (Session.user.notification) {
			Session.user.notification = false;
			AuthService.updateProfile(Session.user).then(function () {
				$scope.user = Session.user;
			});
		} else {
			Session.user.notification = true;
			AuthService.updateProfile(Session.user).then(function () {
				$scope.user = Session.user;
			});
			$http.post('http://notify.elasticbeanstalk.com/parkito/hotifications/'+Session.user.uid);
			var alertPopup = $ionicPopup.alert({
		     	title: 'Push notifications ON',
		     	template: 'You will be notified via push notifications.'
		   	});
		}
	}
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		// $scope.modal.remove();
	});
	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
	// Execute action
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
	// Execute action
	});


	// $scope.postThanks();
})
.controller('DialogPostCtrl', function($scope, $rootScope, $state, NgMap, $firebaseObject, $ionicPopup, $ionicModal, $timeout, $ionicLoading, CONST, Session, AuthService, $firebaseArray) {
    $ionicLoading.show();	
	var areasCoords = $firebaseArray(new Firebase(CONST.fire).child("chatcoords"));
	
	NgMap.getMap().then(function(map) {
	 //    angular.forEach($rootScope.areaCircle,function (circle) {
		// 	circle.setMap(null);
		// });
	 //    angular.forEach($rootScope.label,function (label) {
		// 	label.setMap(null);
		// });
		$scope.areasMode = false;
		// current position
		var options = {
	      enableHighAccuracy: true,
	      timeout: 5000,
	      maximumAge: 0
	    };

	    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2, radius) {
		  var R = 6371; // Radius of the earth in km
		  var dLat = deg2rad(lat2-lat1);  // deg2rad below
		  var dLon = deg2rad(lon2-lon1); 
		  var a = 
		    Math.sin(dLat/2) * Math.sin(dLat/2) +
		    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		    Math.sin(dLon/2) * Math.sin(dLon/2)
		    ; 
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		  var d = R * c * 1000; // Distance in km
		  // console.log(d)
		  return d<=radius;
		}

		function deg2rad(deg) {
		  return deg * (Math.PI/180)
		}
	    // if allowed
	    function success(pos) {

	    	// created object to store address, coordinates and waiting time
		    $scope.spot = {}
			var crd = pos.coords;
			var style = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}];
			map.setOptions({styles: style});
			map.setCenter({lat: crd.latitude, lng: crd.longitude});
			map.setZoom(18);


			var geocoder = new google.maps.Geocoder;
 			var infowindow = new google.maps.InfoWindow;
		    
 			var coordinates = map.getCenter();
		    geocodeLatLng(geocoder, map, infowindow, coordinates);
		    var ref = new Firebase(CONST.fire);
			$scope.areas = $firebaseArray(ref.child('/chatcoords'));	
			$scope.areas.$loaded().then(function () {
			    var keep = true;
			    $ionicLoading.hide();
				
				angular.forEach($scope.areas, function(area) {
				
	    			if (keep) {
						if (getDistanceFromLatLonInKm(crd.latitude, crd.longitude, area.coords.lat, area.coords.lng, area.radius)) {
							$scope.closesChatId = area.id;
							$scope.closesChatName = area.name;
							$scope.inZone = true;
							keep = false;
						} else {
							$scope.inZone = false;
							$scope.closesChatId = null;
							$scope.closesChatName = "No area";
						}
					}
		        });
				var defaultChat = $scope.areas.$getRecord(Session.user.defaultChatId);
		    	var colors = ['#79BCE0','#79BCE0','#79BCE0', '#79BCE0', '#79BCE0']
		        var areaCircle = new google.maps.Circle({
			      strokeColor: '#D5CCA5',
			      strokeOpacity: 1,
			      strokeWeight: 2,
			      fillColor: colors[Math.floor(Math.random() * colors.length)],
			      fillOpacity: 0.05,
			      map: map,
			      center: {lat: defaultChat.coords.lat, lng: defaultChat.coords.lng},
			      radius: $scope.areas.radius
			    });

			});    

		    map.addListener('dragend', function() {
			    coordinates = map.getCenter();
			   
			    geocodeLatLng(geocoder, map, infowindow, coordinates);

			    var keep = true;
			    
	    		angular.forEach($scope.areas, function(area) {
	    			if (keep) {
						if (getDistanceFromLatLonInKm(coordinates.lat(), coordinates.lng(), area.coords.lat, area.coords.lng, area.radius)) {
							$scope.closesChatId = area.id;
							$scope.closesChatName = area.name;
							$scope.inZone = true;
							keep = false;
						} else {
							$scope.inZone = false;
							$scope.closesChatId = null;
							$scope.closesChatName =  "No area";
						}
	    			}
		        });
			});

		    function geocodeLatLng(geocoder, map, infowindow, coordinates) {
			  var latlng = coordinates;
			  geocoder.geocode({'location': latlng}, function(results, status) {
			    if (status === google.maps.GeocoderStatus.OK) {
			      if (results[1]) {
			      	// console.log(results[0].formatted_address)
			        // $scope.address = results[0].formatted_address;
			        var full_address = results[0].formatted_address;
			        $scope.spot.formatted_address = full_address.substring(0, full_address.indexOf(','));
			        $scope.spot.coordinates = {lat: coordinates.lat(), lng: coordinates.lng()};

			        $scope.$apply();
			      } else {
			        console.log('No results found');
			      }
			    } else {
			    	$scope.inZone = false;
			      	console.log('Geocoder failed due to: ' + status);
			    }
			  });
			}
	    }

	    // if not
	    function error(err) {
	      console.log('ERROR(' + err.code + '): ' + err.message);
	    };
	    // var ref = new Firebase(CONST.fire);
		// $scope.areas = $firebaseObject(ref.child('/chatcoords/'+Session.user.defaultChatId));
	    
	    
	    // $scope.areas.$loaded().then(function () {
		    

	    	navigator.geolocation.getCurrentPosition(success, error, options);    
	    // });

	});

	$scope.postUrgent = function () {
		if ($scope.inZone) {
			if (postIt(1)) {
				var alertPopup = $ionicPopup.alert({
			     	title: 'You are amazing!',
			     	template: 'Thank you very much!'
			   	});

			   	alertPopup.then(function(res) {
					$scope.close();
			   	});
			}
		} else {
			var alertPopup = $ionicPopup.alert({
		     	title: 'You are out of zone',
		     	template: 'Sorry, you cant post parking spots out of community area!'
		   	});
	   }
		
	}

	

	var postIt = function (waitingtime) {

		var now = new Date().getTime();

		$scope.spot.mestype = "spot";
		$scope.spot.name = $scope.closesChatName;
		$scope.spot.taken = false;
		$scope.spot.timeposted = now;
		$scope.spot.timedeadline = now + (1000 * 60 * waitingtime);
		$scope.spot.timestamp = Firebase.ServerValue.TIMESTAMP;

		if (Session.user) {
			$scope.spot.user = {
				displayName : Session.user.displayName,
				profileImageURL : Session.user.profileImageURL,
				uid : Session.user.uid
			}

		}

    	
		var chatRef = new Firebase(CONST.fire).child("chatcontents/"+$scope.closesChatId);
		var newSpot = chatRef.push();
		newSpot.set($scope.spot);

		$scope.spot.posted = true;
		var storyRef = new Firebase(CONST.fire).child("userstory/"+Session.user.uid);
		var recentSpot = storyRef.push();
		recentSpot.set($scope.spot);

		return true;
	}

	// Triggered on a button click, or some other target
	$scope.showPopup = function() {
		if ($scope.inZone) {
			  $scope.spot.waitingtime = 5;
			  // An elaborate, custom popup
			  $scope.myPopup = $ionicPopup.show({
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
							return postIt($scope.spot.waitingtime);
						}
			        	
			        }
			      }
			    ]
			  });

			$scope.myPopup.then(function(res) {
				// console.log(res)
			  	if (res) {
					console.log("Posted");
					var alertPopup = $ionicPopup.alert({
				     	title: 'You are amazing!',
				     	template: 'Thank you very much!'
				   	});

				   alertPopup.then(function(res) {
						$scope.close();
				     // console.log('Thank you for not eating my delicious ice cream cone');
				   });
			  	} else {
			  		$scope.myPopup.hide();
			  	}
			});
			
		} else {
			var alertPopup = $ionicPopup.alert({
		     	title: 'You are out of zone',
		     	template: 'Sorry, you cant post parking spots out of community area!'
		   	});
	   }

	}

	$scope.close = function () {
	    $state.go('tab.dialogs');
	}

})
.controller('ModalCtrl', function($scope, $rootScope, NgMap, $ionicPopup, $ionicModal, $timeout, CONST, Session, AuthService) {

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
			        var full_address = results[0].formatted_address;
			        $scope.spot.formatted_address = full_address.substring(0, full_address.indexOf(','));
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

	// Triggered on a button click, or some other target
	// $scope.showPopup = function() {

	// 	  $scope.spot.waitingtime = 5;
	// 	  ""
	// 	  // An elaborate, custom popup
	// 	  var myPopup = $ionicPopup.show({
	// 	    template: "<div class=\"list\"><div class=\"item item-text-wrap\" style=\"background-color: transparent; color: white;text-align: center;font-size: 20px;border: none; \">  {{spot.waitingtime}} min </div>  <div class=\"item range range-positive\">    <i class=\"icon ion-clock assertive\"></i>    <input ng-model=\"spot.waitingtime\" type=\"range\" min=\"0\" max=\"15\"> <i class=\"icon balanced ion-clock\"></i>  </div></div>",
	// 	    title: 'How long you will wait?',
	// 	    subTitle: 'Drag <i class="icon ion-arrow-left-c"></i><i class="icon ion-arrow-right-c"></i> to change',
	// 	    scope: $scope,
	// 	    buttons: [
	// 	      { text: '<i class="icon ion-arrow-left-c"></i>',
	// 	      	onTap: function(e) {
	// 	        	return false;
	// 	        } 
	// 	    	},
	// 	      {
	// 	        text: '<b>Post</b>',
	// 	        type: 'button-positive',
	// 	        onTap: function(e) {
	// 	        	if ($scope.spot.waitingtime) {
	// 					var now = new Date().getTime();

	// 					$scope.spot.mestype = "spot";
	// 					$scope.spot.name = "CHatname";
	// 					$scope.spot.taken = false;
	// 					$scope.spot.timeposted = now;
	// 					$scope.spot.timedeadline = now + (1000 * 60 * $scope.spot.waitingtime);
	// 					$scope.spot.timestamp = Firebase.ServerValue.TIMESTAMP;

	// 					if (Session.user) {
	// 						$scope.spot.user = {
	// 							displayName : Session.user.displayName,
	// 							profileImageURL : Session.user.profileImageURL,
	// 							uid : Session.user.uid
	// 						}

	// 					}

		            	
	// 					var chatRef = new Firebase(CONST.fire).child("chatcontents/"+Session.user.defaultChatId);
	// 					var newSpot = chatRef.push();
	// 					newSpot.set($scope.spot);

	// 					$scope.spot.posted = true;
	// 					var storyRef = new Firebase(CONST.fire).child("userstory/"+Session.user.uid);
	// 					var recentSpot = storyRef.push();
	// 					recentSpot.set($scope.spot);

	//             		return true;

	// 	        	};
	// 	        }
	// 	      }
	// 	    ]
	// 	  });

	// 	myPopup.then(function(res) {
	// 	  	if (res) {
	// 			console.log("Posted");
	// 			$rootScope.closeModal();
	// 	  	} else {
	// 	  		$rootScope.closeModal();
	// 	  	}
	// 	});
	// }

})
.controller('ViewmapCtrl', function($scope, $rootScope, NgMap, $firebaseArray, CONST, $state, $ionicLoading, AuthService, Session) {
	// Loading spin
	$ionicLoading.show({
      template: 'Loading the beauty...'
    });
	// Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // console.log()
	  });

    $scope.$on('$ionicView.beforeEnter', function () {
    	console.log("entered");
    })

	NgMap.getMap().then(function(map) {
		// current position
		var options = {
	      enableHighAccuracy: true,
	      timeout: 5000,
	      maximumAge: 0
	    };

	    // if allowed
	    function success(pos) {


	    	var colors = ['#79BCE0','#79BCE0','#79BCE0', '#79BCE0', '#79BCE0']

	    	// created object to store address, coordinates and waiting time
		    $scope.spot = {}
			var crd = pos.coords;

			map.setCenter({lat: crd.latitude, lng: crd.longitude});
			map.setZoom(14);

			var style = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
			map.setOptions({styles: style});

			var geocoder = new google.maps.Geocoder;
 			var infowindow = new google.maps.InfoWindow;
		    
 			var coordinates = map.getCenter();
		    geocodeLatLng(geocoder, map, infowindow, coordinates);

		    
		    if ($scope.areasMode) {
		    	var ref = new Firebase(CONST.fire);
		    	$scope.areas = $firebaseArray(ref.child('/chatcoords'));
		    	$rootScope.areaCircle = {}
		    	$rootScope.label = {}
		        $scope.areas.$loaded().then(function () {
			    		angular.forEach($scope.areas, function(area) {
						    // Add the circle for this city to the map.
						    var areaCircle = new google.maps.Circle({
						      strokeColor: '#D5CCA5',
						      strokeOpacity: 1,
						      strokeWeight: 2,
						      fillColor: colors[Math.floor(Math.random() * colors.length)],
						      fillOpacity: 0.10,
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
						    	console.log("lol")
		    					if ($scope.areasMode) {

							    	Session.user.defaultChatId = area.$id;
							    	Session.user.defaultChatName = area.name;

							    	console.log(Session.user)

							    	AuthService.updateProfile(Session.user).then(function (result) {
							          if (result.success) {
									    // $state.go('tab.dialog-detail',{ id : area.$id, name: area.name})
								    	$rootScope.closeModal();
							          } else {
							            console.log("Couldn't set default area");
							          }
							        })
							    }
							});
				        });
						$ionicLoading.hide();
		        });
		    } else {
				$ionicLoading.hide();    	
		    }

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
	    }

	    navigator.geolocation.getCurrentPosition(success, error, options);    

	});
	

});