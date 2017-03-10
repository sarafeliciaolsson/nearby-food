var map;
var userPosition;
var infowindow;

/*
* Funktion som initiera Google Maps kartan och tar redan
* användarens position med geolocation
*/
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


/*
* Funktion som tar emot användarens position och sätter ut marker
* för användarens position
*/
function showPosition(position) {
    var latlon = {lat:position.coords.latitude, lng: position.coords.longitude};
	console.log(latlon);
	userPosition = latlon;

	var marker = new google.maps.Marker({
		position: userPosition,
		map: map,
		title: 'Hello World!',
		icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png'	  
	});
	
	makeSearch(userPosition);
}

/*
* Funktion som gör sökningen av närliggande resturanger från användarens * position
*/
function makeSearch(userPosition){
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch ({
	  location: userPosition,
	  radius: 500,
	  type: ['restaurant']
	}, callback);
}

/*
* Funktion som tar emot närliggande resturanger ifrån APIn
*/
function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
	  	}
	}
}

/*
* Funktion som sätter ut alla resturanger i kartan och sätter ut en 
* ikon för varje resturang
*/

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location
	});

	map.setZoom(15);
	map.panTo(marker.position);
	google.maps.event.addListener(marker, 'click', function() {
	  infowindow.setContent(place.name);
	  infowindow.open(map, this);
	});
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