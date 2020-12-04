// DATA;
// =============:
var currentLocation;
var savedCities = [];

function init() {
	savedCities = JSON.parse(localStorage.getItem("citiesList"));
	if (savedCities) {
		currentLocation = savedCities.slice(-1)[0];
	} else {
		getCurrentLocation();
	}
}

// Geolocation;
function getCurrentLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getLocalWeather);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

// API Call;
// =============:
function getLocalWeather(position) {
	var userLat = position.coords.latitude;
	var userLong = position.coords.longitude;
	var apiKey = "730286483f9e2582f1e71e975fa30872";
	var exclude = "";
	var openWeatherURL =
		"https://api.openweathermap.org/data/2.5/weather?lat=" +
		userLat +
		"&lon=" +
		userLong +
		"&units=imperial&exclude=" +
		exclude +
		"&appid=" +
		apiKey;
	$.ajax({
		url: openWeatherURL,
		type: "GET",
		dataType: "json",
		success: function (data) {
			createCurrentCard(data);
		}
	});
}

// Create Current Forecast;
// =============:
function createCurrentCard(res) {
	// Current Date;
	const currentDate = moment(res.dt, "X").format("dddd, MMMM Do YYYY, h:mm a");

	//Card;
	const card = $("<div>").addClass("card bg-light");
	$(".forecast").append(card);

	// Card Header;
	const cardHeader = $("<div>").addClass("card-header").text(res.name);
	card.append(cardHeader);

	// Card Row;
	const cardRow = $("<div>").addClass("row no-gutters");
	card.append(cardRow);

	// Icon from OpenWeather;
	const iconURL =
		"https://openweathermap.org/img/wn/" + res.weather[0].icon + "@2x.png";

	// Card IMG
	const cardImg = $("<div>")
		.addClass("col-md-4")
		.append($("<img>").attr("src", iconURL).addClass("card-img"));
	cardRow.append(cardImg);

	// Card Text;
	const cardText = $("<div>").addClass("col-md-8");
	cardRow.append(cardText);

	// Card Body;
	// =============:
	const cardBody = $("<div>").addClass("card-body");
	cardText.append(cardBody);

	// - City Name;
	cardBody.append($("<h3>").addClass("card-title").text(res.name));

	// - Current Date;
	cardBody.append(
		$("<p>")
			.addClass("card-text")
			.append(
				$("<small>")
					.attr("class", "text-muted")
					.text("Last updated: " + currentDate)
			)
	);
	// - Temperature;
	cardBody.append(
		$("<p>")
			.addClass("card-text")
			.html("Temperature: " + res.main.temp + " &#8457;")
	);
	// - Humidity;
	cardBody.append(
		$("<p>")
			.addClass("card-text")
			.text("Humidity: " + res.main.humidity + "%")
	);
	// - Wind Speed;
	cardBody.append(
		$("<p>")
			.addClass("card-text")
			.text("Wind Speed: " + res.wind.speed + " MPH")
	);
}

$(document).ready(init());
