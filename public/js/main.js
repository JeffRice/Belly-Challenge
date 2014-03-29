$(document).ready(function() {



var config = {
apiKey: 'OUZWCMD3MYTVZQEA1P3RDHYAMECBHZ2POAL5D4XIYVIO3HEC',
authUrl: 'https://foursquare.com/',
apiUrl: 'https://api.foursquare.com/'
};

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
$.bbq.pushState({}, 2)
} else if ($.bbq.getState('error')) {
console.log('bbq state error');
} else {
console.log('no token redirection');
doAuthRedirect();
}


  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
console.log('got position');



    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    var img = new Image();
    img.src = "http://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);


var config = {
apiKey: 'OUZWCMD3MYTVZQEA1P3RDHYAMECBHZ2POAL5D4XIYVIO3HEC',
authUrl: 'https://foursquare.com/',
apiUrl: 'https://api.foursquare.com/'
};




/* Query foursquare API for venue recommendations near the current location. */

$.getJSON(config.apiUrl + 'v2/venues/explore?v=20140128&ll=' + latitude + ',' + longitude + '&oauth_token=' + token, { limit: 20, enableHighAccuracy: true }, function(data) {
venues = data['response']['groups'][0]['items'];
console.log('got venues json');
/* Loop through venues and assign variables to their returned properties. */
for (var i = 0; i < venues.length; i++) {

   name = venues[i]['venue']['name'];
   category = venues[i]['venue']['categories'][0]['name'];
   icon = venues[i]['venue']['categories'][0]['icon']['prefix'];
   icon = icon.slice(0, -1); // remove trailing "_" character
   icon = icon + venues[i]['venue']['categories'][0]['icon']['suffix'];
   address = venues[i]['venue']['location']['address'];
   city = venues[i]['venue']['location']['city'];
   state = venues[i]['venue']['location']['state'];
   distance_meters = venues[i]['venue']['location']['distance'];
   distance_miles = distance_meters / 1609.34;
   distance_miles = Math.round(distance_miles*100)/100;
   x = 1; // in the product use i for index below
   $( "#4square" ).append( name + '<br />' );


}
})




};

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  };

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);


});
