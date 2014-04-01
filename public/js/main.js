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

$.getJSON(config.apiUrl + 'v2/venues/explore?v=20140128&ll=' + latitude + ',' + longitude + '&oauth_token=' + token, { limit: 50, enableHighAccuracy: true, sortByDistance: true }, function(data) {
venues = data['response']['groups'][0]['items'];
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
/* Set venue open variable if its available */
   if(venues[i]['venue']['hours']){
   open = venues[i]['venue']['hours']['isOpen'];
   if (open === true){
   open = 'open';
}
   else {
   open = 'closed'
}
}

   else{
   open = 'no hourly info'
}

   $( "#4square" ).append( "<div class='data-list-item'>" + "<div class='col-1-4'><img src='" + icon + "' />" + '</div>' + "<div class='col-1-2'><span class='title'>" + name + "</span><br />" + distance_miles + " miles away </br>" + category + "</div>" + "<div class='col-1-4r'>" + open + '</div></div><br /><br /><hr>' );
}
})





};

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  };

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);


});
