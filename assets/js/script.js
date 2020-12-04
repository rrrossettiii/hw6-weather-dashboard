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

// Current Location API Call;
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
		success: function (res) {
			getCurrentDayForecast(res);
			getFiveDayForecast(res.id);
		}
	});
}

// Create Current Forecast;
// =============:
function getCurrentDayForecast(res) {
	// Current Date;
	const currentDate = moment(res.dt, "X").format("dddd, MMMM Do YYYY, h:mm a");

	//Card;
	const card = $("<div>").addClass("card text-white bg-dark");
	$(".forecastDisplay").append(card);

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

	// UV API Call;
	// =============:
	const uvURL =
		"https://api.openweathermap.org/data/2.5/uvi?appid=7e4c7478cc7ee1e11440bf55a8358ec3&lat=" +
		res.coord.lat +
		"&lon=" +
		res.coord.lat;
	$.ajax({
		url: uvURL,
		method: "GET"
	}).then(function (uvRes) {
		// - Set background color;
		const uvIndex = uvRes.value;
		var bgColor;
		if (uvIndex <= 3) {
			bgColor = "green";
		} else if (uvIndex >= 3 || uvIndex <= 6) {
			bgColor = "yellow";
		} else if (uvIndex >= 6 || uvIndex <= 8) {
			bgColor = "orange";
		} else {
			bgColor = "red";
		}
		const cardUV = $("<p>").addClass("card-text").text("UV Index: ");
		cardUV.append(
			$("<span>")
				.addClass("uvIndex")
				.attr("style", "background-color:" + bgColor)
				.text(uvIndex)
		);
		cardBody.append(cardUV);
	});
}

// Display 5-Day-Forecast;
// =============:
function getFiveDayForecast(city) {
	// - 5 Day Forecast API Call;
	// =============:
	var queryURL =
		"https://api.openweathermap.org/data/2.5/forecast?id=" +
		city +
		"&APPID=7e4c7478cc7ee1e11440bf55a8358ec3&units=imperial";
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function (response) {
		// - Forecast Container Row;
		var newRow = $("<div>").addClass("fiveDayForecasts row");
		$(".forecastDisplay").append(newRow);

		// Create Cards LOOP;
		// =============:
		for (i = 0; i < response.list.length; i++) {
			if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
				// - Columns;
				const newCol = $("<div>").addClass("col allDays");
				newRow.append(newCol);

				// - Cards;
				const newCard = $("<div>").addClass("card text-white bg-secondary");
				newCol.append(newCard);

				// - Card Headers;
				const cardHeader = $("<div>")
					.addClass("card-header")
					.text(moment(response.list[i].dt, "X").format("MMM Do"));
				newCard.append(cardHeader);

				// - Card Images;
				const cardImg = $("<img>")
					.addClass("card-img-top")
					.attr(
						"src",
						"https://openweathermap.org/img/wn/" +
							response.list[i].weather[0].icon +
							"@2x.png"
					);
				newCard.append(cardImg);

				// Card Body
				// =============:
				const cardBody = $("<div>").addClass("card-body");
				newCard.append(cardBody);

				// - Temperature;
				cardBody.append(
					$("<p>")
						.addClass("card-text")
						.html("Temp: <br>" + response.list[i].main.temp + " \u00B0F")
				);
				// - Humidity;
				cardBody.append(
					$("<p>")
						.addClass("card-text")
						.text("Humidity: " + response.list[i].main.humidity + "%")
				);
			}
		}
	});
}

$(document).ready(init());
