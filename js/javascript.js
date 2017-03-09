var map;
var userPosition;
var infowindow;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 55.5916628, lng: 12.9875187},
	  zoom: 12
	});
	
	infowindow = new google.maps.InfoWindow();
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        //x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latlon = {lat:position.coords.latitude, lng: position.coords.longitude};
	console.log(latlon);
	userPosition = latlon;
	makeSearch(userPosition);
}

function makeSearch(userPosition){
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: userPosition,
          radius: 500,
          type: ['store']
        }, callback);
	console.log("HEJ");
}

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }


      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }



/*
		
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
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
	  for (var i = 0; i < results.length; i++) {
		createMarker(results[i]);
	  }
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location
});

google.maps.event.addListener(marker, 'click', function() {
  infowindow.setContent(place.name);
  infowindow.open(map, this);
});
}
	*/


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