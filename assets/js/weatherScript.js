// Global variables
var lat;
var lon;
var weatherApiKey = 'b38319b9575fb449167d2125fd88dd05';
var openWeatherApiUrl = 'https://api.openweathermap.org/';
var searchHistory = [];

// DOM element references
var searchForm = document.querySelector('#searchForm');
var cityInput = document.querySelector('#cityInput');
var recentSearchCtnr = document.querySelector('#recentSearchesCtr');
var todayCtnr = document.querySelector('#todayContainer');
var forecastCtnr = document.querySelector('#forecastCtr');

// Display the search history list
function displayHistory() {
  recentSearchCtnr.innerHTML = '';

  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('recent-btn', 'btn-history', 'btn', 'btn-primary', 'mt-2', 'w-100');
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    recentSearchCtnr.append(btn);
  }
}

// Append history to local storage
function appendHistory(search) {
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);

  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  displayHistory();
}

// Initialize history from local storage
function initHistory() {
  var storedHistory = localStorage.getItem('search-history');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  displayHistory();
}

// Display the current weather data from Open Weather API
function displayCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
  var temp = weather.main.temp;
  var wind = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = createCardElement('div', 'card');
  var cardBody = createCardElement('div', 'card-body');
  var heading = createCardElement('h2', 'h3 card-title', `${city} (${date})`);
  var weatherIcon = createCardElement('img', 'weather-img');
  var tempEl = createWeatherInfo('p', 'card-text', `Temp: ${temp} F`);
  var windEl = createWeatherInfo('p', 'card-text', `Windspeed: ${wind} mph`);
  var humidityEl = createWeatherInfo('p', 'card-text', `Humidity: ${humidity} %`);

  cardBody.append(heading, weatherIcon, tempEl, windEl, humidityEl);
  card.append(cardBody);
  weatherIcon.src = iconUrl;
  weatherIcon.alt = iconDescription;

  todayCtnr.innerHTML = '';
  todayCtnr.append(card);
}

// Display forecast card from Open Weather API
function displayForecastCard(forecast) {
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var temp = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var wind = forecast.wind.speed;

  var col = createCardElement('div', 'col-md five-day-card');
  var card = createCardElement('div', 'card bg-primary h-100 text-white');
  var cardBody = createCardElement('div', 'card-body p-2');
  var cardTitle = createCardElement('h5', 'card-title', dayjs(forecast.dt_txt).format('M/D/YYYY'));
  var weatherIcon = createCardElement('img');
  var tempEl = createWeatherInfo('p', 'card-text', `Temp: ${temp} F`);
  var windEl = createWeatherInfo('p', 'card-text', `Windspeed: ${wind} mph`);
  var humidityEl = createWeatherInfo('p', 'card-text', `Humidity: ${humidity} %`);

  col.appendChild(card);
  card.appendChild(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
  weatherIcon.src = iconUrl;
  weatherIcon.alt = iconDescription;

  forecastCtnr.append(col);
}

// Display the 5-day forecast
function displayForecast(dailyForecast) {
  var startDt = dayjs().add(1, 'day').startOf('day').unix();
  var endDt = dayjs().add(6, 'day').startOf('day');

  var headingCol = createCardElement('div', 'col-12');
  var heading = createCardElement('h2', 'text-center text-primary', '5-Day Forecast:');

  headingCol.appendChild(heading);
  forecastCtnr.innerHTML = '';
  forecastCtnr.appendChild(headingCol);

  for (var i = 0; i < dailyForecast.length; i++) {
    if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
      if (dailyForecast[i].dt_txt.slice(11, 13) == '12') {
        displayForecastCard(dailyForecast[i]);
      }
    }
  }
}

// Initialize the current weather and forecast
function initItems(city, data) {
  displayCurrentWeather(city, data.list[0]);
  displayForecast(data.list);
}

// Fetch weather data for a given location from the Open Weather API
function fetchWeather(location) {
  var { lat, lon, name } = location;
  var apiUrl = `${openWeatherApiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      initItems(name, data);
    });
}

// Fetch coordinates for a city search
function fetchCoords(search) {
  var apiUrl = `${openWeatherApiUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        fetchWeather(data[0]);
        appendHistory(search);
      }
    });
}

// Handle search form submission
function handleSearchSubmit(e) {
  e.preventDefault();

  if (!cityInput.value) {
    return;
  }

  var search = cityInput.value.trim();
  fetchCoords(search);
  cityInput.value = '';
}

// Handle recent search history click
function handleRecentSearchClick(e) {
  if (!e.target.matches('.btn-history')) {
    return;
  }

  var search = e.target.getAttribute('data-search');
  fetchCoords(search);
}

// Helper function to create a card element with provided class names and text content
function createCardElement(element, classNames, textContent) {
  var el = document.createElement(element);
  el.className = classNames;
  if (textContent) {
    el.textContent = textContent;
  }
  return el;
}

// Helper function to create weather info elements
function createWeatherInfo(element, classNames, textContent) {
  var el = document.createElement(element);
  el.className = classNames;
  el.textContent = textContent;
  return el;
}

// Event listeners
searchForm.addEventListener('submit', handleSearchSubmit);
recentSearchCtnr.addEventListener('click', handleRecentSearchClick);

// Initialize the application
initHistory();
