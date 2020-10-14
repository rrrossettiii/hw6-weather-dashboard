
// Get users location and plug it into openWeatherAPI
$(document).ready(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
    function showPosition(position) {
        var userLat = position.coords.latitude
        var userLon = position.coords.longitude
        var userExclude = ''
        var APIKey = '730286483f9e2582f1e71e975fa30872'
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + userLat + "&lon=" + userLon + "&exclude=" + userExclude + "&-=" + APIKey;

        $.getJSON(queryURL).then(function(data) {
            userLocationOW = data
            console.log(data);
        });}})