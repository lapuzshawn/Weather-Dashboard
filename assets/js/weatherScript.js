// Global variables
var lat;
var lon;
var weatherApiKey = 'b38319b9575fb449167d2125fd88dd05';
var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
var weatherApiUrl = `https://api.openweathermap.org/`;
var searchHistory = [];
// DOM element references
var searchForm = document.querySelector('#searchForm');
var cityInput = document.querySelector('#cityInput');
var recentSearches = document.querySelector('#recentSearches');
var todayContainer = document.querySelector('#todayContainer');
var cityContainer = document.querySelector('#cityContainer');
// var tempContainer = document.querySelector('#tempCtr');
// var windContainer = document.querySelector('#windCtr');
// var humidContainer = document.querySelector('#humidCtr');
var forecastContainer = document.querySelector('#forecastCtr');
// var searchButton = document.querySelector('#todayContainer');
var todayHd = document.querySelector('#todayHeading');

// Function to display the search history list.
function renderSearchHistory() {

  }
  
  // Function to update history in local storage then updates displayed history.
  function appendToHistory(search) {

  }
  
  // Function to get search history from local storage
  function initSearchHistory() {

  }
  
/********** RENDER FUNCTIONS */

  // Function to display the current weather data fetched from OpenWeather api.
  function renderCurrentWeather(city, weather) {
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
    tempEl.textContent = `Temp: ${temp}°F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);
  
    todayContainer.innerHTML = '';
    todayContainer.append(card);
  }
  
  // Function to display a forecast card given an object from open weather api
  // daily forecast.
  function renderForecastCard(forecast) {
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
  
    col.className = 'col-md';
    col.classList.add('five-day-card');
    card.className = 'card bg-primary h-100 text-white';
    cardBody.className = 'card-body p-2';
    cardTitle.className = 'card-title';
    tempEl.className = 'card-text';
    windEl.className = 'card-text';
    humidityEl.className = 'card-text';
  
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.src = iconUrl;
    weatherIcon.alt = iconDescription;
    tempEl.textContent = `Temp: ${temp} °F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
  
    forecastContainer.append(col);
  }
  

  // Function to display 5 day forecast.
  function renderForecast(dailyForecast) {
    // Create timestamps for start and end of 5 day forecast


  }
// xx Function to render weather today and forecast.
  function renderItems(city, data) {
    renderCurrentWeather(city, data.list[0], data.city.timezone);
    renderForecast()
  }
  
/**********   FETCH FUNCTIONS */

  // Fetches weather data for given location from the Weather Geolocation endpoint;
  //   then, calls functions to display current and forecast weather data.
  function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
  
    var apiUrl = `${weatherApiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        renderItems(city, data);
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  
//   Fetches coordinates for given location
  function fetchCoords(search) {
    var apiUrl = `${weatherApiUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          // appendToHistory(search);
          fetchWeather(data[0]);

          console.log(data);
        }
      })
      /*
      .catch(function (err) {
        console.error(err);
      });*/
  }
  
/********** HANDLER FUNCTIONS */
  function handleSearchFormSubmit(e) {
    // XX Don't continue if there is nothing in the search form
    if (!cityInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = cityInput.value.trim();
    fetchCoords(search);
    cityInput.value = '';
  }
  
  // function handleSearchHistoryClick(e) {
  //   // Don't do search if current elements is not a search history button
  //   if (!e.target.matches('.btn-history')) {
  //     return;
  //   }
  
  //   var btn = e.target;
  //   var search = btn.getAttribute('data-search');
  //   fetchCoords(search);
  // }
  
// Initialize the application
initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
// recentSearches.addEventListener('click', handleSearchHistoryClick);

  