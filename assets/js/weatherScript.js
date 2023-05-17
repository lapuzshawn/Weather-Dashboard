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
var forecastContainer = document.querySelector('#forecastContainer');
// var searchButton = document.querySelector('#todayContainer');


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

  }
  
  // Function to display a forecast card given an object from open weather api
  // daily forecast.
  function renderForecastCard(forecast) {
    // variables for data from api
  
    // Create elements for a card

    // Add content to elements

  }
  
  // Function to display 5 day forecast.
  function renderForecast(dailyForecast) {
    // Create timestamps for start and end of 5 day forecast


  }
// Function to render weather today and forecast.
  function renderItems(city, data) {

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
          appendToHistory(search);
          fetchWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  
/********** HANDLER FUNCTIONS */
  function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!cityInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = cityInput.value.trim();
    fetchCoords(search);
    cityInput.value = '';
  }
  
  function handleSearchHistoryClick(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
      return;
    }
  
    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchCoords(search);
  }
  
// Initialize the application
initSearchHistory();
searchForm.addEventListener('submit', handleSearchFormSubmit);
recentSearches.addEventListener('click', handleSearchHistoryClick);

  