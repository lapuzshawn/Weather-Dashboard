// Global variables
var lat;
var lon;
var weatherApiKey = 'b38319b9575fb449167d2125fd88dd05';
var openWeatherApiUrl = 'https://api.openweathermap.org/';
var searchHistory = [];
var searchForm = document.querySelector('#searchForm');
var cityInput = document.querySelector('#cityInput');
var recentSearchCtnr = document.querySelector('#recentSearchesCtr');
var todayCtnr = document.querySelector('#todayContainer');
var cityCtnr = document.querySelector('#cityContainer');
var forecastCtnr = document.querySelector('#forecastCtr');
var todayHdg = document.querySelector('#todayHeading');

// Display the search history list
function displayHistory() {
  recentSearchCtnr.innerHTML = '';

  searchHistory.slice().reverse().forEach(function (search) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('recent-btn', 'btn-history', 'btn', 'btn-primary', 'mt-2', 'w-100');
    btn.setAttribute('data-search', search);
    btn.textContent = search;
    recentSearchCtnr.append(btn);
  });
}

// Appends history to local storage
function appendHistory(search) {
  if (!searchHistory.includes(search)) {
    searchHistory.push(search);
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    displayHistory();
  }
}

// Initialize history from local storage
function initHistory() {
  var storedHistory = localStorage.getItem('search-history');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  displayHistory();
}

/********** RENDER FUNCTIONS */

// Display the current weather data from Open Weather api.
function displayCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
  var temp = weather.main.temp;
  var wind = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  card.className = 'card';
  cardBody.className = 'card-body';
  card.append(cardBody);

  heading.className = 'h3 card-title';
  tempEl.className = 'card-text';
  windEl.className = 'card-text';
  humidityEl.className = 'card-text';

  heading.textContent = `${city} (${date})`;
  weatherIcon.src = iconUrl;
  weatherIcon.alt = iconDescription;
  weatherIcon.className = 'weather-img';
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${temp} F`;
  windEl.textContent = `Windspeed: ${wind} mph`;
  humidityEl.textContent = `Humidity: ${humidity} %`;
  cardBody.append(heading, tempEl, windEl, humidityEl);

  todayCtnr.innerHTML = '';
  todayCtnr.append(card);
}

// Display forecast card from Open Weather api
function displayForecastCard(forecast) {
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var temp = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var wind = forecast.wind.speed;

  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  col.appendChild(card);
  card.appendChild(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.className = 'col-md five-day-card';
  card.className = 'card bg-primary h-100 text-white';
  cardBody.className = 'card-body p-2';
  cardTitle.className = 'card-title';
  tempEl.className = 'card-text';
  windEl.className = 'card-text';
  humidityEl.className = 'card-text';

  cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
  weatherIcon.src = iconUrl;
  weatherIcon.alt = iconDescription;
  tempEl.textContent = `Temp: ${temp} F`;
  windEl.textContent = `Windspeed: ${wind} mph`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  forecastCtnr.append(col);
}

function displayForecast(dailyForecast) {
  var startDt = dayjs().add(1, 'day').startOf('day').unix();
  var endDt = dayjs().add(6, 'day').startOf('day');

  var headingCol = document.createElement('div');
  var heading = document.createElement('h2');

  headingCol.className = 'col-12';
  heading.textContent = '5-Day Forecast:';
  heading.classList.add('text-center', 'text-primary');
  headingCol.appendChild(heading);

  forecastCtnr.innerHTML = '';
  forecastCtnr.appendChild(headingCol);

  dailyForecast.forEach(function (forecast) {
    if (forecast.dt >= startDt && forecast.dt < endDt && forecast.dt_txt.slice(11, 13) === '12') {
      displayForecastCard(forecast);
    }
  });
}

// Calls on functions for currentWeather and forecast.
function initItems(city, data) {
  displayCurrentWeather(city, data.list[0]);
  displayForecast(data.list);
}

/**********   FETCH FUNCTIONS */

// Fetches weather data for given location from the Weather Geolocation endpoint;
//   then, calls functions to display current and forecast weather data.
function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.name;
  var apiUrl = `${openWeatherApiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      initItems(city, data);
    });
}

// Fetches coordinates for city search
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
        console.log(data);
      }
    });
}

/********** HANDLER FUNCTIONS */
function handleSearchSubmit(e) {
  e.preventDefault();
  // Don't continue if there is nothing in the search form
  if (!cityInput.value) {
    return;
  }

  var search = cityInput.value.trim();
  fetchCoords(search);
  cityInput.value = '';
}

function handleRecentSearchClick(e) {
  // Don't do search if current element is not a search history button
  if (!e.target.matches('.btn-history')) {
    return;
  }

  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}

// Initialize the application
initHistory();
searchForm.addEventListener('submit', handleSearchSubmit);
recentSearchCtnr.addEventListener('click', handleRecentSearchClick);
