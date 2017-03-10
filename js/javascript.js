var map;
var infowindow;
var service;
var userPosition;
var idCounter = 0;
var listArray = new Array();

/*
* Funktion som initiera Google Maps kartan och tar redan
*/
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 55.5916628, lng: 12.9875187},
	  zoom: 12
	});
	service = new google.maps.places.PlacesService(map);
	infowindow = new google.maps.InfoWindow();
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
	var request = {
		location: userPos,
	  	radius: 500,
	  	type: ['restaurant']
	}
	service.nearbySearch(request, callback);
}

/*
* Funktion som tar emot närliggande resturanger ifrån APIn
*/
function callback(results, status) {
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