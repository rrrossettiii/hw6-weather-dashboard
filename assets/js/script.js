// DATA;
// =============:
const currentLocation = [];
var savedCities = [];

function init() {
	savedCities = JSON.parse(localStorage.getItem("citiesList"));
	if (savedCities) {
		// currentLocation.push(savedCities.slice(-1)[0]);
		getCurrentLocation();
		showCitiesList();
	} else {
		console.log("success");
	}
}

// Geolocation;
// =============:
function getCurrentLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
			coordinatesToOpenWeather =
				"lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
			getWeather(oneCall, coordinatesToOpenWeather);
		});
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

var oneCall = "onecall?";
var weather = "forecast?";

// OpenWeather API Call;
// =============:
function getWeather(call, search) {
	var apiKey = "730286483f9e2582f1e71e975fa30872";
	var openWeatherURL =
		"https://api.openweathermap.org/data/2.5/" +
		call +
		search +
		"&units=imperial&appid=" +
		apiKey;
	$.ajax({
		url: openWeatherURL,
		type: "GET",
		dataType: "json",
		success: function (res) {
			console.log(res);

			getCurrentDayForecast(res);
			getFiveDayForecast(res.daily);
		}
	});
}

// Show Cities List;
// =============:
function showCitiesList() {
	//show the previously searched for locations based on what is in local storage
	if (savedCities) {
		$(".cities").empty();
		var cityList = $("<div>").attr("class", "list-group");
		for (var i = 0; i < savedCities.length; i++) {
			var cityButton = $("<a>").attr("href", "#").text(savedCities[i]);
			if (savedCities[i] == currentLocation) {
				cityButton.addClass(
					"cityButton list-group-item list-group-item-action active"
				);
			} else {
				cityButton.attr(
					"class",
					"cityButton list-group-item list-group-item-action"
				);
			}
			cityList.prepend(cityButton);
		}
		$(".cities").append(cityList);
	}
}

// Search New City;
// =============:
$("#searchButton").on("click", function (event) {
	event.preventDefault();
	const city = $("#searchInput").val().trim();
	// - Check if empty;
	if (city !== "") {
		// - Clear;
		clearForecastDisplay();
		$("#searchInput").val("");
		// currentLocation = city;
		saveCity(city);
		getWeather(weather, "q=" + city);
	}
});

// Select Previous City;
// =============:
$(document).on("click", ".cityButton", function (event) {
	event.preventDefault();
	clearForecastDisplay();
	showCitiesList();
	thisCity = $(this).text();
	getWeather(weather, "q=" + thisCity);
});

// Save City;
// =============:
function saveCity(city) {
	if (savedCities === null) {
		savedCities = [city];
	} else if (savedCities.indexOf(city) === -1) {
		savedCities.push(city);
	}
	localStorage.setItem("citiesList", JSON.stringify(savedCities));
	showCitiesList();
}

// Clear Forecast Display;
// =============:
function clearForecastDisplay() {
	$(".forecastDisplay").empty();
}

// Create Current Forecast;
// =============:
console.log(currentLocation);
function getCurrentDayForecast({
	timezone,
	current: { dt, temp, humidity, speed, uvi, weather }
}) {
	// Current Date; - momentJS
	const currentDate = moment(dt, "X").format("dddd, MMMM Do YYYY, h:mm a");

	const cityName = timezone.split("/")[1].replace("_", " ");

	//Card;
	const card = $("<div>").addClass("card currentDay text-white bg-dark");
	$(".forecastDisplay").append(card);
	// Card Header;
	const cardHeader = $("<div>").addClass("card-header").text(timezone);
	card.append(cardHeader);
	// Card Row;
	const cardRow = $("<div>").addClass("row no-gutters");
	card.append(cardRow);
	// Icon from OpenWeather API;
	const iconURL =
		"https://openweathermap.org/img/wn/" + weather[0].icon + "@4x.png";
	// Card IMG;
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
	cardBody.append($("<h3>").addClass("card-title").text(cityName));
	// - Current Date;
	cardBody.append(
		$("<p>")
			.addClass("card-text")
			.append(
				$("<small>")
					.attr("class", "text-muted")
					.text("Updated: " + currentDate)
			)
	);
	// - Temperature;
	cardBody.append(
		$("<p>")
			.addClass("card-text")
			.html("Temperature: " + temp + " &#8457;")
	);
	// - Humidity;
	cardBody.append(
		$("<p>")
			.addClass("card-text")
			.text("Humidity: " + humidity + "%")
	);
	// - Wind Speed;
	cardBody.append(
		$("<p>")
			.addClass("card-text")
			.text("Wind Speed: " + speed + " MPH")
	);

	// - UV-Index;
	// =============:
	var bgColor;
	if (uvi <= 3) {
		bgColor = "green";
	} else if (uvi >= 3 || uvIndex <= 6) {
		bgColor = "yellow";
	} else if (uvi >= 6 || uvIndex <= 8) {
		bgColor = "orange";
	} else {
		bgColor = "red";
	}
	const cardUV = $("<p>").addClass("card-text").text("UV Index: ");
	cardUV.append(
		$("<span>")
			.addClass("uvIndex")
			.attr("style", "background-color:" + bgColor)
			.text(uvi)
	);
	cardBody.append(cardUV);
}

// Display 5-Day-Forecast;
// =============:
function getFiveDayForecast(days) {
	// - Forecast Container Row;
	var newRow = $("<div>").addClass("fiveDayForecasts row");
	$(".forecastDisplay").append(newRow);

	// Create Cards LOOP;
	// =============:
	for (i = 0; i < 5; i++) {
		// - Column(s);
		const newCol = $("<div>").addClass("col allDays");
		newRow.append(newCol);

		// - Card(s);
		const newCard = $("<div>").addClass(
			`card card-${i} text-white bg-secondary`
		);
		newCol.append(newCard);

		// - Card Header(s);
		const cardHeader = $("<div>")
			.addClass("card-header")
			.text(moment(days[i].dt, "X").format("MMM Do"));
		newCard.append(cardHeader);

		// - Card Image(s);
		const cardImg = $("<img>")
			.addClass("card-img-top")
			.attr(
				"src",
				"https://openweathermap.org/img/wn/" +
					days[i].weather[0].icon +
					"@4x.png"
			);
		newCard.append(cardImg);

		// Card Body(s);
		// =============:
		const cardBody = $("<div>").addClass("card-body");
		newCard.append(cardBody);

		// - Temperature(s);
		cardBody.append(
			$("<p>")
				.addClass("card-text")
				.html(
					"Temp: <br>" +
						Math.floor(days[i].temp.min) +
						" - " +
						Math.floor(days[i].temp.max) +
						" \u00B0F"
				)
		);
		// - Humidity;
		cardBody.append(
			$("<p>")
				.addClass("card-text")
				.text("Humidity: " + days[i].humidity + "%")
		);
	}
}

$(document).ready(init());
