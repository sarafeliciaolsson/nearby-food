var map;
var infowindow;
var service;
var userPosition;
var idCounter = 0;
var idCounterTwo = 0;
var listArray = new Array();
var listTwoArray = new Array();
/*
* Funktion som initiera Google Maps kartan och tar redan
*/
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 55.5916628, lng: 12.9875187},
	  zoom: 12,
      scrollwheel: false
	});
	var card = document.getElementById('pac-card');
	var input = document.getElementById('pac-input');
	var types = document.getElementById('type-selector');
	var strictBounds = document.getElementById('strict-bounds-selector');

	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

	var autocomplete = new google.maps.places.Autocomplete(input);

	// Bind the map's bounds (viewport) property to the autocomplete object,
	// so that the autocomplete requests use the current map bounds for the
	// bounds option in the request.
	autocomplete.bindTo('bounds', map);
	service = new google.maps.places.PlacesService(map);
	var infowindow = new google.maps.InfoWindow();
	var infowindowContent = document.getElementById('infowindow-content');
	infowindow.setContent(infowindowContent);
	var marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, -29)
	});

	autocomplete.addListener('place_changed', function() {
		infowindow.close();
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			window.alert("No details available for input: '" + place.name + "'");
			return;
		}

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(13);  // Why 17? Because it looks good.

		}
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		var address = '';
		if (place.address_components) {
			console.log(place)
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}

		infowindowContent.children['place-icon'].src = place.icon;
		infowindowContent.children['place-name'].textContent = place.name;
		infowindowContent.children['place-address'].textContent = address;
		infowindow.open(map, marker);
		var button = document.querySelector("#searchBtn")
		button.className = "btn btn-dark btn-lg activated";
	});

	// Sets a listener on a radio button to change the filter type on Places
	// Autocomplete.
	function setupClickListener(id, types) {
		var radioButton = document.getElementById(id);
		radioButton.addEventListener('click', function() {
			autocomplete.setTypes(types);
		});
	}

	setupClickListener('changetype-all', []);
	setupClickListener('changetype-address', ['address']);
	setupClickListener('changetype-establishment', ['establishment']);
	setupClickListener('changetype-geocode', ['geocode']);

	document.getElementById('use-strict-bounds')
			.addEventListener('click', function() {
				console.log('Checkbox clicked! New state=' + this.checked);
				autocomplete.setOptions({strictBounds: this.checked});
			});
}

/*
* Funktion som triggras när man klickar på Get Location knappen
* funktionen tar reda på användarens position
*/
$("#getLocationBtn").click(function() {
	var location_timeout = setTimeout("geolocFail()", 10000);

	document.getElementById('getLocationBtn').innerHTML= "Loading...  <span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
			clearTimeout(location_timeout);
			userPosition = {lat:position.coords.latitude, lng: position.coords.longitude};
			console.log(userPosition);
			makeSearch(userPosition);
      document.getElementById('getLocationBtn').innerHTML= "Got it ✓";
			var button = document.querySelector("#searchBtn")
			button.className = "btn btn-dark btn-lg activated";




		},function(error) {
        	clearTimeout(location_timeout);
        	geolocFail();
		});
	} else {
        alert("Geolocation is not supported by this browser.");
    }
});



function showSearch(){
    var pacCard = document.querySelector("#pac-card");
    pacCard.className = "pac-card visShow";
}




/*
* Funktion som gör sökningen av närliggande resturanger från användarens position
*/
function makeSearch(userPosition){
	var userPos = userPosition;
	console.log(userPosition)
	var request = {
		location: userPos,
	  	radius: 1000,
	  	type: ['restaurant'],
		opennow: true
	}
	service.nearbySearch(request, callback);

}

/*
* Funktion som tar emot närliggande resturanger ifrån APIn
*/
function callback(results, status) {
	console.log(status)
	console.log(results)
    $("resultsFromAPI").text(" ");
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			if (i <= 9) {
			$("#resultFromAPI").append('<a class="selectedRestaurang" id='+idCounter+'>' + results[i].name + '</a>');
			var restaurantSection = document.querySelector("#portfolio");
	       restaurantSection.className = "show";
			listArray.push(results[i]);
			idCounter++;
            } else {
                $("#resultTwoFromAPI").append('<a href="#map" class="selectedRestaurang" id='+idCounterTwo+'>' + results[i].name + '</a>');
                listTwoArray.push(results[i]);
                idCounterTwo++;
            }
        }

		createUserMarker();
	}
}

/*
* Funktion som skapar markern för användarens position i kartan
*/
function createUserMarker(){
	var userMarker = new google.maps.Marker({
		position: userPosition,
		map: map,
		title: 'Din position',
		icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png'
	});

	google.maps.event.addListener(userMarker, 'click', function() {
		infowindow.setContent("Din position");
		infowindow.open(map, this);
	});
}

/*
* Funktion som triggas när man klickar på ett resturangnamn i listan
* funktionen tar reda på vilken resturang man har klickat
*/
$('#resultFromAPI').on('click', '.selectedRestaurang', function(){
	console.log(this.id);
	console.log(listArray[this.id]);
	var currentId = listArray[this.id];
	createMarker(currentId);
});
$('#resultTwoFromAPI').on('click', '.selectedRestaurang', function(){
	console.log(this.id);
	console.log(listTwoArray[this.id]);
	var currentId = listTwoArray[this.id];
	createMarker(currentId);
});

/*
* Funktion som sätter ut en marker för en vald resturang
* Visar även detljer för varje resturang i liten ruta när
* man klickar på en ikon
*/

function createMarker(place) {
	var los = place.geometry.location;
	var infowindow = new google.maps.InfoWindow({ map: map });
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location
	});

	marker.addListener('click', function(){
		var request = {
			reference: place.reference
		};
		service.getDetails(request, function(details, status) {
			console.log(details)
			infowindow.setContent([
			details.name,
			details.formatted_address,
			details.website,
			details.opening_hours.weekday_text[0],
			details.opening_hours.weekday_text[1],
			details.opening_hours.weekday_text[2],
			details.opening_hours.weekday_text[3],
			details.opening_hours.weekday_text[4],
			details.opening_hours.weekday_text[5],
			details.opening_hours.weekday_text[6],
			'Betyg ' + details.rating,
			details.formatted_phone_number].join("<br />"));
		  infowindow.open(map, marker);
		});
	})

	map.setZoom(15);
	map.panTo(marker.position);
}

// ----- DÖLJER ALLT UTOM FÖRSTASIDAN I FÖRSTA LÄGET & VISAR ALLT NÄR MAN TRYCKER PÅ SÖK -----




function show(){
    var menuSection = document.querySelector(".menu");
		var portfolio = document.querySelector("#portfolio");
    var mapSection = document.querySelector("#contact");
    var footerSection = document.querySelector("#footer");
		var map = document.querySelector("#map")


    menuSection.className = "visShow";
		portfolio.className = "show"
    mapSection.className = "show";
    footerSection.className = "show";
		map.className ="show"

		$(document).ready(function() {
    $(window).resize(function() {
        google.maps.event.trigger(map, 'resize');
    });
    google.maps.event.trigger(map, 'resize');
});

}



function activateSearch(){
		var button = document.querySelector("#searchBtn");
		if (button.classList.contains("activated")){
			show()
			$(window).scrollTop($('#portfolio').offset().top);
		}else{
			alert("Please choose a option above")
		}


}
