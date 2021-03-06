var map;
var infowindow;
var service;
var userPosition;
var idCounter = 0;
var idCounterTwo = 0;
var listArray = new Array();
var listTwoArray = new Array();
var searchBox;
var isGetLocationChecked = false;
var userMarker;
var d = new Date();
var foodTime;
/*
* Funktion som initiera Google Maps kartan och tar redan
*/

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 55.5916628, lng: 12.9875187},
	  zoom: 12,
      scrollwheel: false
	});

	service = new google.maps.places.PlacesService(map);
	infowindow = new google.maps.InfoWindow();
	autoCompleteFunction();
	
	var currentTime = (d.getHours() + "" + d.getMinutes());
	console.log(currentTime);
	if(currentTime >= 0600 && currentTime < 1000){
		foodTime = "Breakfast";
	}else if(currentTime >= 1000 && currentTime < 1600){
		foodTime = "Lunch";
	}else if(currentTime >= 1600 && currentTime <= 2400){
		foodTime = "Dinner";
	}else{
		foodTime = null;
	}
	console.log(foodTime);
}

function autoCompleteFunction(){
  var input = document.getElementById('pac-input');
  searchBox = new google.maps.places.Autocomplete(input);
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
}

/*
* Funktion som triggras när man klickar på Get Location knappen
* funktionen tar reda på användarens position
*/
$("#getLocationBtn").click(function() {
	var location_timeout = setTimeout("geolocFail()", 10000);
	document.getElementById('getLocationBtn').innerHTML= "Locating...  <span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";

	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
			clearTimeout(location_timeout);
			userPosition = {lat:position.coords.latitude, lng: position.coords.longitude};
			console.log(userPosition);
			makeSearch(userPosition);
            document.getElementById("getLocationBtn").innerHTML= "Got it ✓";
			if (position){
				var button = document.querySelector("#searchBtn");
				button.className = "btn btn-dark btn-lg activated";
				isGetLocationChecked = true;
			}
			document.getElementById('resultFromAPI').innerHTML= " ";
			document.getElementById('resultTwoFromAPI').innerHTML= " ";
		},function(error) {
            document.getElementById('getLocationBtn').innerHTML= "Access denied   &#10006;";
            clearTimeout(location_timeout);
		});
	} else {
        document.getElementById('getLocationBtn').innerHTML= "Geolocation not supported";
        alert("Geolocation is not supported by this browser.");
    }
});

$("#searchBtn").click(function(){
	if($('#pac-input').val().length != 0){
        document.getElementById('resultFromAPI').innerHTML= " ";
        document.getElementById('resultTwoFromAPI').innerHTML= " ";
		var place = searchBox.getPlace();
		var latitude = place.geometry.location.lat();
		var longitude = place.geometry.location.lng();
		var location = {lat: latitude, lng: longitude};
		makeSearch(location);
		show();
		$('html, body').animate({
            scrollTop: $("#portfolio").offset().top
    	}, 2000);
			var placeholder = document.getElementById('pac-input').value
			document.getElementById('pac-input').placeholder= placeholder
			document.getElementById('pac-input').value= "";
	}else if(isGetLocationChecked == true){
		show();
		$('html, body').animate({
            scrollTop: $("#portfolio").offset().top
		}, 2000);
	}else{
		alert("Something went wrong, please write an adress or press to get your location!");
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
	console.log(userPosition);
	var request = {
		location: userPos,
	  	radius: 1000,
	  	type: ['restaurant'],
		keyword: foodTime,
		opennow: true
	};
	service.nearbySearch(request, callback);
}

/*
* Funktion som tar emot närliggande resturanger ifrån APIn
*/
function callback(results, status) {
	console.log(status);
	console.log(results);
    $("resultsFromAPI").text(" ");
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			if (i <= 9) {
				$("#resultFromAPI").append('<a href="#topBtn" class="selectedRestaurang" id='+idCounter+'>' + results[i].name + '</a>');
				var restaurantSection = document.querySelector("#portfolio");
				restaurantSection.className = "show";
				listArray.push(results[i]);
				idCounter++;
            } else {
                $("#resultTwoFromAPI").append('<a href="#topBtn" class="selectedRestaurang" id='+idCounterTwo+'>' + results[i].name + '</a>');
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
	if (userMarker){
		userMarker.setMap(null);
	}
	userMarker = new google.maps.Marker({
		position: userPosition,
		map: map,
		title: 'Din position',
		icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png'
	});

	google.maps.event.addListener(userMarker, 'click', function() {
		infowindow.setContent("Your position");
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
	$('html, body').animate({
        scrollTop: $("#contact").offset().top
    }, 2000);
});

$('#resultTwoFromAPI').on('click', '.selectedRestaurang', function(){
	console.log(this.id);
	console.log(listTwoArray[this.id]);
	var currentId = listTwoArray[this.id];
	createMarker(currentId);
	$('html, body').animate({
        scrollTop: $("#contact").offset().top
    }, 2000);
});

/*
* Funktion som sätter ut en marker för en vald resturang
* Visar även detljer för varje resturang i liten ruta när
* man klickar på en ikon
*/

function createMarker(place) {
	var los = place.geometry.location;
	var infowindow = new google.maps.InfoWindow({ map: map });
    infowindow.close();
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location
	});

	marker.addListener('click', function(){
		var request = { reference: place.reference };
		
		service.getDetails(request, function(details, status) {
			console.log(details)
			if (details.opening_hours){
				infowindow.setContent([
				details.name,
				details.formatted_address,
				'<a href="' + details.website +'">' + details.website + '</a>',
				details.opening_hours.weekday_text[0],
				details.opening_hours.weekday_text[1],
				details.opening_hours.weekday_text[2],
				details.opening_hours.weekday_text[3],
				details.opening_hours.weekday_text[4],
				details.opening_hours.weekday_text[5],
				details.opening_hours.weekday_text[6],
				'Betyg: ' + details.rating,
				details.formatted_phone_number].join("<br />"));
			}else{
				infowindow.setContent([
				details.name,
				details.formatted_address,
				'<a href="' + details.website +'">' + details.website + '</a>',
				'Betyg: ' + details.rating,
				details.formatted_phone_number].join("<br />"));
			}
		  infowindow.open(map, marker);
		});
	})
	map.setZoom(15);
	map.panTo(marker.position);
}


// ----- DÖLJER ALLT UTOM FÖRSTASIDAN I FÖRSTA LÄGET & VISAR ALLT NÄR MAN TRYCKER PÅ SÖK -----
function show(){
    var menuSection = document.querySelector("#menuPlacement");
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
