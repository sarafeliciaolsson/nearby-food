var map;
var userPosition;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 55.5916628, lng: 12.9875187},
	  zoom: 12
	});
}

$( ".ourBtn" ).click(function() {
	alert("Test");
	
	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
			userPosition = {lat:pos["lat"], lng:pos["lng"]};
            console.log("LAT: " + pos["lat"])
            console.log("LNG: " + pos["lng"])
			console.log(userPosition);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
	});

$( "#searchBtn" ).click(function() {
	if(userPosition != null){
		var infoWindow = new google.maps.InfoWindow({map: map});
		var request = {
			location: userPosition,
			radius: 500,
			type: ['restaurant']	 
		}

		infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.textSearch(request, callback);
		//service.nearbySearch(request, callback);

		infoWindow.setPosition(userPosition);
		infoWindow.setContent('Location found.');
		map.setCenter(userPosition);	
	}else{
		alert("Användarens position finns inte");
	}
	
});

/*
* Funktion som tar emot alla resturanger i närheten från API
*/
function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
	  for (var i = 0; i < results.length; i++) {
		createMarker(results[i]);
		createInput(results[i]);  
	  }
	}
}

function createInput(place){
	var photos = place.photos;
  	if (!photos) {
    	return;
  	}
	//var p1 = userPosition;
	//var p2 = place.geometry.location.lat() + " " + place.geometry.location.lng() ; 
	$("#test").append('<h1>' + place.name + '</h1>' +
					 '<img src="' + photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) + '" alt="img">' +  +
					 '<h2>'+ place.formatted_address  + '</h2>');
	console.log( place.opening_hours.weekday_text[0]);

	//console.log((google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}

/**
* Funktion som skapar en marker och sätter ut den på kartan
*/
function createMarker(place) {	
 	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		title: place.name
  	});
	
	/*var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
	  map: map,
	  position: userPosition,
		icon: photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
	});
	*/
	var marker1 = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location,
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
		'Place ID: ' + place.place_id + '<br>' +
		place.formatted_address + '</div>');
		infowindow.open(map, this);
	});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
						  'Error: The Geolocation service failed.' :
						  'Error: Your browser doesn\'t support geolocation.');
}


// ----- DÖLJER ALLT UTOM FÖRSTASIDAN I FÖRSTA LÄGET & VISAR ALLT NÄR MAN TRYCKER PÅ SÖK -----
    var searchBtn = document.querySelector("#searchBtn");
    searchBtn.addEventListener("click", show);

function show(){
    var menuSection = document.querySelector(".menu");
    var restaurantSection = document.querySelector("#portfolio");
    var mapSection = document.querySelector("#contact");
    var footerSection = document.querySelector("#footer");
    
    if(menuSection.className && restaurantSection.className && mapSection.className && footerSection.className !== "hide"){
        menuSection.className = "show";
        restaurantSection.className = "show";
        mapSection.className = "show";
        footerSection.className = "show";
        initMap();
    }
}