var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 55.5916628, lng: 12.9875187},
	  zoom: 13
	});
}

$( "#searchBtn" ).click(function() {
	alert("Test");
	var userPos;
    var infoWindow = new google.maps.InfoWindow({map: map});
	
	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
			userPos = {lat:pos["lat"], lng:pos["lng"]};
            console.log("LAT: " + pos["lat"])
            console.log("LNG: " + pos["lng"])
			
			var request = {
				location: userPos,
				radius: 500,
				type: ['restaurant']	 
			}
			
			infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(map);
			//service.textSearch(request, callback);
			service.nearbySearch(request, callback);

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
	});

/*
* Funktion som tar emot alla resturanger i närheten från API
*/
function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
	  for (var i = 0; i < results.length; i++) {
		createMarker(results[i]);
	  }
	}
}

/**
* Funktion som skapar en marker och sätter ut den på kartan
*/
function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location
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


// ----- DÖLJER SECTIONEN FÖR RESTAURANGRESULTATEN & VISAR NÄR MAN TRYCKER PÅ SÖK -----
    var searchBtn = document.querySelector("#searchBtn");
    searchBtn.addEventListener("click", show);

function show(){
    var menu = document.querySelector("#menu-toggle");
    var restaurantSection = document.querySelector("#portfolio");
    var mapSection = document.querySelector("#contact");
    var footerSection = document.querySelector("#footer");
    
    if(menu.className && restaurantSection.className && mapSection.className && footerSection.className != "hide"){
        menu.className = "show";
        restaurantSection.className = "show";
        mapSection.className = "show";
        footerSection.className = "show";
        initMap();
    }
}