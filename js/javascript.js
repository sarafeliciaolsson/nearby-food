function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 55.5916628, lng: 12.9875187},
          zoom: 13
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log("LAT: " + pos["lat"])
            console.log("LNG: " + pos["lng"])

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