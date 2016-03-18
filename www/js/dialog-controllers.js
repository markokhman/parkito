angular.module('dialog-controllers', ['firebase','ngMap','angular-svg-round-progress'])

.controller('DialogsCtrl', function($scope, $firebaseArray, CONST, AuthService, Session, $timeout, INFO, $rootScope, $ionicPopup, $state, $ionicModal, $ionicPlatform) {
	Ionic.io();
	

	$scope.invite = function () {
		window.plugins.socialsharing.share(null, null, null, 'http://www.parkito.io/'+Session.user.defaultChatName);
	}

	$scope.info = function () {
		window.open('http://www.parkito.io/info', '_system', 'location=yes');
	}


	var push = new Ionic.Push({
	  "debug": false,
	  "onNotification": function(notification) {
	    var payload = notification.payload;
	    console.log(notification, payload);
	    var alertPopup = $ionicPopup.alert({
	     	title: 'Hey, it\'s Parkito!',
	     	template: '<p style="font-size:23px;">'+notification.text+'</p>'
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

	  	console.log($scope.user)
	  	// $ionicLoading.show({
	   //    	template: 'Loading the beauty...'
	   //  });
		// alert("lol");

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

			if (!Session.user.defaultChatId) {
				
				// Ionic #modal should be here
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
			if (!Session.user.defaultChatId) {
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
		};

		Ionic.User.load(Session.user.uid).then(success, failure);



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

			console.log($scope.user);
			if (!Session.user.defaultChatId) {
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

			console.log(Session.user);
			if (!Session.user.defaultChatId) {
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
		};

		Ionic.User.load(Session.user.uid).then(success, failure);

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

.directive('helloWorld', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      scope: {
        endTimeAttr: '=endTime',
        chat: '=chat',
        id: '=id',
        taken: '=taken'
      },
      controller : function ($timeout, $scope) {
      	var now;

      	var tick = function () {
      		now = new Date().getTime();
      		
      		$scope.total = $scope.endTimeAttr - now;
      		
      		if ($scope.total>0 && !$scope.taken) {
      			$scope.seconds=Math.floor(($scope.total/1000)%60);
				$scope.minutes=Math.floor(($scope.total/(1000*60))%60);

				if ($scope.seconds<10) {
					$scope.seconds = "0"+$scope.seconds;
				}
				if ($scope.minutes<10) {
					$scope.minutes = "0"+$scope.minutes;
				}
      		    $timeout(function () {
      		    
      				tick();
      		    }, 1000);
      		} else {
      			$scope.seconds = "00";
				$scope.minutes = "00";

				var chatRef = new Firebase("https://parkito.firebaseio.com").child("chatcontents/"+$scope.chat+"/"+$scope.id+"/taken");
                chatRef.set(true);
                var trashRef = new Firebase("https://parkito.firebaseio.com").child("chatstrash/"+$scope.chat+"/"+$scope.id+"/expired");
                trashRef.set(true);
      		}
      	}

      	tick();
      },
      template: "<h3 class=\"thecount\">{{minutes}}:{{seconds}}</h3>"
  };
})
.directive('timeEnd', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      scope: {
        endTimeAttr: '=endTime'
      },
      controller : function ($timeout, $scope) {
      	Date.prototype.customFormat = function(formatString){
		  var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
		  YY = ((YYYY=this.getFullYear())+"").slice(-2);
		  MM = (M=this.getMonth()+1)<10?('0'+M):M;
		  MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
		  DD = (D=this.getDate())<10?('0'+D):D;
		  DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
		  th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
		  formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
		  h=(hhh=this.getHours());
		  if (h==0) h=24;
		  if (h>12) h-=12;
		  hh = h<10?('0'+h):h;
		  hhhh = h<10?('0'+hhh):hhh;
		  AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
		  mm=(m=this.getMinutes())<10?('0'+m):m;
		  ss=(s=this.getSeconds())<10?('0'+s):s;
		  return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
		};
      	$scope.time = new Date($scope.endTimeAttr).customFormat( "#hhh#:#mm#" );
      	$scope.date = new Date($scope.endTimeAttr).customFormat( "#DD# #MMM#" );

      },
      template: "<h3 style=\"position: absolute;top: 11px;right: 15px;\"><b>{{time}}</b> <br> {{date}}</h3>"
  };
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

	$scope.goToMap = function () {
		window.open('https://www.google.com/maps/d/u/0/viewer?mid=zTfxHH3ozQ78.kqGT2_t8CgiQ', '_system', 'location=yes');
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
	var query = chatRef.orderByChild("timestamp").limitToLast(15);
	
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
		if (!spot.taken) {
		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
		    template: '<h2 style="color:white;">Do you want to take this spot on '+spot.formatted_address+'?</h2><br><p>Redirecting to WAZE<p>',
		    title: '',
		    subTitle: '',
		    scope: $scope,
		    buttons: [
		      { text: '<i class="ion-icon ion-android-close "></i>',
		        type: 'button-closeit',
		      	onTap: function(e) {
		        	return false;
		        } 
    		},
		      {
		        text: '<i class="ion-icon ion-android-done"></i>',
		        type: 'button-closeit',
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

				$http.post('http://notify.elasticbeanstalk.com/parkito/notifications/ownernotifier/'+spot.user.uid);
				// $http.post('http://localhost:8081/parkito/notifications/ownernotifier/'+spot.user.uid);

				
		    	window.open("waze://?ll="+spot.coordinates.lat+","+spot.coordinates.lng+"&navigate=yes", "_system");
		  	};
		  });
		}
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
				// $http.post('http://notify.elasticbeanstalk.com/parkito/hotifications/'+Session.user.uid);
				$http.post('http://localhost:8081/parkito/hotifications/'+Session.user.uid);
				var alertPopup = $ionicPopup.alert({
			     	title: 'Push notifications ON',
			     	template: 'You will be notified about available parking spots'
			   	});
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

		function inside(point, vs) {
			console.log(point)
			console.log(vs)

		    var x = point[0], y = point[1];
		    console.log(vs.length);

		    var inside = false;
		    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		        var xi = vs[i][0], yi = vs[i][1];
		        var xj = vs[j][0], yj = vs[j][1];

		        var intersect = ((yi > y) != (yj > y))
		            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		        if (intersect) inside = !inside;
		    	console.log(inside);
		        
		    }
		    return inside;
		}

		function checkcheck (x, y, cornersX, cornersY) {

			var i, j=cornersX.length-1 ;
			var  oddNodes=false;

			var polyX = cornersX;
			var polyY = cornersY;

			for (i=0; i<cornersX.length; i++) {
			    if ((polyY[i]< y && polyY[j]>=y ||  polyY[j]< y && polyY[i]>=y)	&&  (polyX[i]<=x || polyX[j]<=x)) {
			      oddNodes^=(polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x); 
			  	}
			    j=i; 
			}

			  return oddNodes;
		}

		function deg2rad(deg) {
		  return deg * (Math.PI/180)
		}
	    // if allowed
	    function success(pos) {

	    	// created object to store address, coordinates and waiting time
		    $scope.spot = {}
			var crd = pos.coords;
			// var style = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}];
			var style = [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}];
			
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

				    // Add the circle for this city to the map.
				    // var areaCircle = new google.maps.Circle({
				    //   strokeColor: '#D5CCA5',
				    //   strokeOpacity: 1,
				    //   strokeWeight: 0,
				    //   fillColor: area.color,
				    //   fillOpacity: 0,
				    //   map: map,
				    //   center: {lat: area.coords.lat, lng: area.coords.lng},
				    //   radius: area.radius
				    // });
					if (area.type=="circle") {
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
					} else {

						if (keep) {
							var areaPoints = []
							var areaPointsX = []
							var areaPointsY = []
							angular.forEach(area.points, function (point) {

								areaPointsX.push(point.lat);
								areaPointsY.push(point.lng);
								areaPoints.push(point);
							})
							if (checkcheck(crd.latitude, crd.longitude, areaPointsX, areaPointsY)) {
								$scope.closesChatId = area.id;
								$scope.closesChatName = area.name;
								$scope.inZone = true;
								keep = false;
							} else {
								$scope.inZone = false;
								$scope.closesChatId = null;
								$scope.closesChatName = "No area";
							}
						};
					};

		        });
				var defaultChat = $scope.areas.$getRecord(Session.user.defaultChatId);
		    	// var colors = ['#79BCE0','#79BCE0','#79BCE0', '#79BCE0', '#79BCE0']
		     //    var areaCircle = new google.maps.Circle({
			    //   strokeColor: '#D5CCA5',
			    //   strokeOpacity: 1,
			    //   strokeWeight: 2,
			    //   fillColor: colors[Math.floor(Math.random() * colors.length)],
			    //   fillOpacity: 0.05,
			    //   map: map,
			    //   center: {lat: defaultChat.coords.lat, lng: defaultChat.coords.lng},
			    //   radius: $scope.areas.radius
			    // });

			});    

		    map.addListener('dragend', function() {
			    coordinates = map.getCenter();
			   
			    geocodeLatLng(geocoder, map, infowindow, coordinates);

			    var keep = true;
			    
	    		angular.forEach($scope.areas, function(area) {
	    			if (area.type=="circle") {
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

	    			} else {
						if (keep) {
							var areaPoints = []
							var areaPointsX = []
							var areaPointsY = []
							angular.forEach(area.points, function (point) {

								areaPointsX.push(point.lat);
								areaPointsY.push(point.lng);
								areaPoints.push(point);
							})
							if (checkcheck(coordinates.lat(), coordinates.lng(), areaPointsX, areaPointsY)) {
								$scope.closesChatId = area.id;
								$scope.closesChatName = area.name;
								$scope.inZone = true;
								keep = false;
							} else {
								$scope.inZone = false;
								$scope.closesChatId = null;
								$scope.closesChatName = "No area";
							}
						};
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

			    	$timeout(function () {
			    		
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

						    	$timeout(function () {
						    		// body...
						    	}, 3000);
						    	$scope.inZone = false;
						      	console.log('Geocoder failed due to: ' + status);
						    }
						});

			    	}, 3000);

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
			     	template: 'Thank you for helping the community!'
			   	});

			   	alertPopup.then(function(res) {
					$scope.close();
			   	});
			}
		} else {
			var alertPopup = $ionicPopup.alert({
		     	title: 'Oops..You are out of the community areas.',
		     	template: 'You can only post parking spots within community areas.'
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
		$scope.closeThisShit = function () {
			$scope.myPopup.hide();
		}
		if ($scope.inZone) {
			  $scope.spot.waitingtime = 5;
			  // An elaborate, custom popup
			  $scope.myPopup = $ionicPopup.show({
			    template: '<span class="mins">{{spot.waitingtime}} min</span><br><br><br><span class="settime"> Set waiting time </span> <br> <img class="dragrange" src="img/dragrange.png"><br><br><div class=\"list\"> <div style="background: transparent;border: none;" class=\"item range range-light\">    <span class="minuten">00:00</span>    <input ng-model=\"spot.waitingtime\" type=\"range\" min=\"0\" max=\"30\"> <span class="minuten">30:00</span>  </div></div> ',
			    title: '',
			    // title: '<button class=\"button-clear \">      <i style=\"color: black;font-size: 30px;padding-left: 15px;padding-top: 30px;\" class=\" the-back ion-android-arrow-back\"></i>      &nbsp;    </button>',
			    subTitle: '&nbsp;',
			    // subTitle: '<span class="mins">'+$scope.spot.waitingtime+ ' min</span><br><span class="settime"> Set waiting time </span> <br> <img class="dragrange" src="img/dragrange.png">',
			    scope: $scope,
			    buttons: [
			      	{ 	
			      		text: '<i class="ion-icon ion-android-close "></i>',
				        type: 'button-closeit',
				      	onTap: function(e) {
				        	return false;
				        } 
			    	},
			      	{
				        text: '&nbsp;',
				        type: 'button-postit',
				        onTap: function(e) {
							if ($scope.spot.waitingtime) {
								// console.log($scope.spot.waitingtime)
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
			  		if ($scope.myPopup) {
			  			$scope.myPopup.hide();
			  		};
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
.controller('ViewmapCtrl', function($scope, $rootScope, NgMap, $firebaseArray, CONST, $state, $ionicLoading, AuthService, $ionicPopup, Session) {
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

    $scope.goToAddArea = function () {
		window.open('http://www.parkito.io/add', '_system', 'location=yes');
	}

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

			var style = [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}];
			map.setOptions({styles: style});

			var geocoder = new google.maps.Geocoder;
 			var infowindow = new google.maps.InfoWindow;
		    
 			var coordinates = map.getCenter();
		    geocodeLatLng(geocoder, map, infowindow, coordinates);

		    
		    if ($scope.areasMode) {
		    	var ref = new Firebase(CONST.fire);
		    	$scope.areas = $firebaseArray(ref.child('/chatcoords'));
		    	$scope.poligons = $firebaseArray(ref.child('/chatpoligons'));
		    	$rootScope.areaCircle = {}
		    	$rootScope.label = {}

		    	

		        $scope.areas.$loaded().then(function () {
			    		angular.forEach($scope.areas, function(area) {
						    // Add the circle for this city to the map.

						    if (area.type=="circle") {
							    var areaCircle = new google.maps.Circle({
							      strokeColor: '#D5CCA5',
							      strokeOpacity: 1,
							      strokeWeight: 0,
							      fillColor: area.color,
							      fillOpacity: 0.40,
							      map: map,
							      center: {lat: area.coords.lat, lng: area.coords.lng},
							      radius: area.radius
							    });

							    var labelText = '<div style="font-family: Roboto-Regular; color: black">'+area.name+'</div>';

							    var myOptions = {
							        content: labelText,
							        boxStyle: {
							            background: 'transparent',
							            border: "0px solid white",
							            pixelOffset: new google.maps.Size(0, 0),
							            textAlign: "center",
							            fontSize: "19pt",
							            opacity: 0.9,
							            width: "90px"
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
				    				$ionicLoading.show();

							    	console.log("lol")
			    					if ($scope.areasMode) {

								    	Session.user.defaultChatId = area.$id;
								    	Session.user.defaultChatName = area.name;

								    	console.log(Session.user)

								    	AuthService.updateProfile(Session.user).then(function (result) {
								          if (result.success) {
										    // $state.go('tab.dialog-detail',{ id : area.$id, name: area.name})
				    						$ionicLoading.hide();

									    	$rootScope.closeModal();
								          } else {
								            console.log("Couldn't set default area");
								          }
								        })
								    }
								});

						    } else {
						    	var triangleCoords = []
								var polygonCoords = []

							 	var bounds = new google.maps.LatLngBounds();
								var i;
								angular.forEach(area.points, function (point) {
									triangleCoords.push(point)
									polygonCoords.push(new google.maps.LatLng(point.lat, point.lng));
								
								})

								// Construct the polygon.
								var bermudaTriangle = new google.maps.Polygon({
								    paths: triangleCoords,
								    strokeColor: '#FF0000',
								    strokeOpacity: 0.8,
								    strokeWeight: 0,
								    fillColor: area.color,
								    fillOpacity: 0.35
								});
								bermudaTriangle.setMap(map);

								for (i = 0; i < polygonCoords.length; i++) {
								  bounds.extend(polygonCoords[i]);
								}

							    var labelText = '<div style="font-family: Roboto-Regular; color: black">'+area.name+'</div>';

							    var myOptions = {
							        content: labelText,
							        boxStyle: {
							            background: 'transparent',
							            border: "0px solid white",
							            pixelOffset: new google.maps.Size(0, 0),
							            textAlign: "center",
							            fontSize: "19pt",
							            opacity: 0.9,
							            width: "90px"
							        },
							        disableAutoPan: true,
							        pixelOffset: new google.maps.Size(-45, 0),
							        position: bounds.getCenter(),
							        closeBoxURL: "",
							        isHidden: false,
							        enableEventPropagation: true
							    };

							    var label = new InfoBox(myOptions);
							    label.open(map);

							    bermudaTriangle.addListener('click', function() {
				    				$ionicLoading.show();

							    	console.log("lol")
			    					if ($scope.areasMode) {

								    	Session.user.defaultChatId = area.$id;
								    	Session.user.defaultChatName = area.name;

								    	console.log(Session.user)

								    	AuthService.updateProfile(Session.user).then(function (result) {
								          if (result.success) {
										    // $state.go('tab.dialog-detail',{ id : area.$id, name: area.name})
				    						$ionicLoading.hide();

									    	$rootScope.closeModal();
								          } else {
								            console.log("Couldn't set default area");
								          }
								        })
								    }
								});
						    }
				        });
						$ionicLoading.hide();
		        });
		    //     $scope.poligons.$loaded().then(function () {
			   //  		angular.forEach($scope.poligons, function(area) {

						// 	var triangleCoords = []
						// 	var polygonCoords = []

						//  	var bounds = new google.maps.LatLngBounds();
						// 	var i;
						// 	angular.forEach(area.points, function (point) {
						// 		triangleCoords.push(point)
						// 		polygonCoords.push(new google.maps.LatLng(point.lat, point.lng));
							
						// 	})

						// 	// Construct the polygon.
						// 	var bermudaTriangle = new google.maps.Polygon({
						// 	    paths: triangleCoords,
						// 	    strokeColor: '#FF0000',
						// 	    strokeOpacity: 0.8,
						// 	    strokeWeight: 0,
						// 	    fillColor: area.color,
						// 	    fillOpacity: 0.35
						// 	});
						// 	bermudaTriangle.setMap(map);

						// 	for (i = 0; i < polygonCoords.length; i++) {
						// 	  bounds.extend(polygonCoords[i]);
						// 	}

						//     var labelText = '<div style="font-family: Roboto-Regular; color: black">'+area.name+'</div>';

						//     var myOptions = {
						//         content: labelText,
						//         boxStyle: {
						//             background: 'transparent',
						//             border: "0px solid white",
						//             pixelOffset: new google.maps.Size(0, 0),
						//             textAlign: "center",
						//             fontSize: "19pt",
						//             opacity: 0.9,
						//             width: "90px"
						//         },
						//         disableAutoPan: true,
						//         pixelOffset: new google.maps.Size(-45, 0),
						//         position: bounds.getCenter(),
						//         closeBoxURL: "",
						//         isHidden: false,
						//         enableEventPropagation: true
						//     };

						//     var label = new InfoBox(myOptions);
						//     label.open(map);

						//     areaCircle.addListener('click', function() {
			   //  				$ionicLoading.show();

						//     	console.log("lol")
		    // 					if ($scope.areasMode) {

						// 	    	Session.user.defaultChatId = area.$id;
						// 	    	Session.user.defaultChatName = area.name;

						// 	    	console.log(Session.user)

						// 	    	AuthService.updateProfile(Session.user).then(function (result) {
						// 	          if (result.success) {
						// 			    // $state.go('tab.dialog-detail',{ id : area.$id, name: area.name})
			   //  						$ionicLoading.hide();

						// 		    	$rootScope.closeModal();
						// 	          } else {
						// 	            console.log("Couldn't set default area");
						// 	          }
						// 	        })
						// 	    }
						// 	});
				  //       });
						// $ionicLoading.hide();
		    //     });
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
	      	var alertPopup = $ionicPopup.alert({
		     	title: 'Geolocation' ,
		     	template: 'Sorry, we can\'t access geoposition on Your device. Please turn it on in Settings and restart the app'
		   	});
	    }

	    navigator.geolocation.getCurrentPosition(success, error, options);    

	});
	

});