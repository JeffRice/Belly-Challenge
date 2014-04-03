$(document).ready(function() {

var output = document.getElementById("out");
var config = {
apiKey: 'OUZWCMD3MYTVZQEA1P3RDHYAMECBHZ2POAL5D4XIYVIO3HEC',
authUrl: 'https://foursquare.com/',
apiUrl: 'https://api.foursquare.com/'
};

// Oauth redirect
function doAuthRedirect() {
var redirect = window.location.href.replace(window.location.hash, '');
var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id=' + config.apiKey +
'&redirect_uri=' + encodeURIComponent(redirect) +
'&state=' + encodeURIComponent($.bbq.getState('req') || 'users/self');
window.location.href = url;
};

// If there is a token in the state, consume it
if ($.bbq.getState('access_token')) {
console.log('token available');
var token = $.bbq.getState('access_token');
localforage.setItem('token', token, function(result) {
    console.log(result);
});
$.bbq.pushState({}, 1)

} else if ($.bbq.getState('error')) {
// If there is a cached token consume that
if (localforage[token]){
var token = localforage[token];
localforage.setItem('token', token, function(result) {
    console.log(result);
});
$.bbq.pushState({}, 1)
}
} else {
doAuthRedirect();
}

/* Message while retrieving geo data */
output.innerHTML = "<p>Locating…</p>";

navigator.geolocation.getCurrentPosition(success, error);

// Check if the geolocation object is available
if (!navigator.geolocation){
  output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
  return;
  }

function success(position) {
// cache coords on successfull retrieval
localforage.setItem('lat', position.coords.latitude, function(result) {
    console.log(result);
});
localforage.setItem('lng', position.coords.longitude, function(result) {
    console.log(result);
});

var lat = position.coords.latitude;
var lng = position.coords.longitude;
console.log('got position');
makeMap(lat, lng);
};

function makeMap(lat, lng) {
// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([lat, lng], 16);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add a marker at your current location
var circle = L.circle([lat, lng], 20, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.35
})
.bindPopup("You were last seen here.")
.addTo(map);

output.innerHTML = '<p>Latitude is ' + lat + '° <br>Longitude is ' + lng + '°</p>';

/* Query foursquare API for venue recommendations near the current location. */

$.getJSON(config.apiUrl + 'v2/venues/explore?v=20140128&ll=' + lat + ',' + lng + '&oauth_token=' + token, { limit: 10, enableHighAccuracy: true, sortByDistance: true }, function(data) {
venues = data['response']['groups'][0]['items'];

localforage.setItem('venues', venues, function(result) {
    console.log(result);
});

console.log('got venues json');
/* Loop through venues and assign variables to their returned properties. */
for (var i = 0; i < venues.length; i++) {

   name = venues[i]['venue']['name'];
   category = venues[i]['venue']['categories'][0]['name'];
   icon = venues[i]['venue']['categories'][0]['icon']['prefix'];
   icon = icon.slice(0, 35) + icon.slice(38, -1); // remove trailing "_" characters
   icon = icon + venues[i]['venue']['categories'][0]['icon']['suffix'];
   city = venues[i]['venue']['location']['city'];
   state = venues[i]['venue']['location']['state'];
   distance_meters = venues[i]['venue']['location']['distance'];
   distance_miles = distance_meters / 1609.34;
   distance_miles = Math.round(distance_miles*100)/100;
   lat = venues[i]['venue']['location']['lat'];
   lng = venues[i]['venue']['location']['lng'];
/* Set venue open variable if its available */
   if(venues[i]['venue']['hours']){
   open = venues[i]['venue']['hours']['isOpen'];
   if (open === true){
   open = "<span class='open'>OPEN</span>";
}
   else {
   open = 'CLOSED'
}
}
   else{
   open = 'no hourly info'
}
// Append queried data
   $( "#4square" ).append( "<div class='data-list-item'>" + "<div class='col-1-4'><img src='" + icon + "' />" + '</div>' + "<div class='col-1-2'><span class='title'>" + name + "</span><br />" + distance_miles + " miles away <br />" + category + "</div>" + "<div class='col-1-4r'>" + open + "<br /><img src='assets/arrow.png' /></div></div><br /><hr>" );

// Add a marker for each venue
L.marker([lat, lng]).addTo(map)
    .bindPopup( name + '<br />' + distance_miles + ' miles away<br />' + category + '<br />' + open )  

}
})

};

  function error() {
/* Use cached geo data if available */
localforage.getItem('lat', function(lat) {
  localforage.getItem('lng', function(lng) {
    output.innerHTML = lat + '' + lng;
  makeMap(lat, lng);
 });
});

/* No geolocation data is available or is cached */
output.innerHTML = "Unable to retrieve your location";
};


});