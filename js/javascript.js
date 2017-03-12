var map;
var infowindow;
var service;
var userPosition;
var idCounter = 0;
var listArray = new Array();
show()
/*
* Funktion som initiera Google Maps kartan och tar redan
*/
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 55.5916628, lng: 12.9875187},
	  zoom: 12
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

	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
			clearTimeout(location_timeout);
			userPosition = {lat:position.coords.latitude, lng: position.coords.longitude};
			console.log(userPosition);
			makeSearch(userPosition)
		},function(error) {
        	clearTimeout(location_timeout);
        	geolocFail();
		});
	} else {
        alert("Geolocation is not supported by this browser.");
    }
});


/*
* Funktion som triggas när man klickar på sök knappen
*/
$("#searchBtn").click(function() {
	if(userPosition != null){
		makeSearch(userPosition);
	}else if(userPosition == null){
		alert("Tryck på knappen Get location och tryck sedan på Sök knappen");
	}
	/*
	else if(INGEN ADRESS){
		alert(Skriv in en adress);
	}
	*/
});



/*
* Funktion som gör sökningen av närliggande resturanger från användarens position
*/
function makeSearch(userPosition){
	var userPos = userPosition;
	console.log(userPosition)
	var request = {
		location: userPos,
	  	radius: 5000,
	  	type: ['restaurant']
	}
	service.nearbySearch(request, callback);
}

/*
* Funktion som tar emot närliggande resturanger ifrån APIn
*/
function callback(results, status) {
	console.log(status)
	console.log(results)
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			//createMarker(results[i]);
			$("#resultFromAPI").append('<h1 class="selectedRestaurang" id='+idCounter+'>' + results[i].name + '</h1>');
			listArray.push(results[i]);
			idCounter++;
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

/*
* Funktion som sätter ut en marker för en vald resturang
* Visar även detljer för varje resturang i liten ruta när
* man klickar på en ikon
*/

function createMarker(place) {
	var los = place.geometry.location;
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location
	});

	marker.addListener('click', function(){
		var request = {
			reference: place.reference
		};
		service.getDetails(request, function(details, status) {

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
			details.rating,
			details.formatted_phone_number].join("<br />"));
		  infowindow.open(map, marker);
		});
	})

	map.setZoom(15);
	map.panTo(marker.position);
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

    }
}


// ------ SKRIVA UT RESTAURANGER --------


/*$("#title").on("keyup", function(){



	$("#title").show();
	$.ajax({
		url: "http://www.omdbapi.com/?s=" + UserInput + "&y=&plot=short&r=json",
		dataType: "JSON"
    }).done(function(data){
        $("#presentRestaurants").html("");

        try{
            var restaurants = data.Search;   //lista av alla restauranger
            console.log(restaurants);

        for(var i = 0; i < restaurants.length; i++) {
            var name = restaurants[i].Name;   //Varje restaurang

            $("#presentRestaurants").append("<h2>" + place.Name + "</h2>");
        });

*/
