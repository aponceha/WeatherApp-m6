const apiKEY = `10e4096d73b2bb6e7b94243a3f5ed52c`;
var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=Toronto&units=metric&appid=${apiKEY}`;

var searchValue = document.getElementById('searchValue');
var searchHistory = document.getElementById('search-history');
const searchHistLocal = JSON.parse(localStorage.getItem('searchJSON')) || [];

var city = document.getElementById('city');

var displayDate = document.getElementById('date');
var today = dayjs().format('dddd, MMMM D, YYYY h:mm A');
displayDate.textContent = today;


var temp = document.getElementById('temp');
var humidity = document.getElementById('humidity');
var wind = document.getElementById('wind');

searchHistory.innerHTML =
  searchHistLocal.map(city => {
    return `<li class="cityBtn" id="${city}">${city}</li>`;
  }).join("");

var cityID = document.querySelectorAll('cityBtn') || "";

document.addEventListener('click', function(e) {
  const target = e.target.closest(".cityBtn")
  if (target) {
    console.log("clicked city button");
    console.log("cityID: " + target.id);
    apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${target.id}&units=metric&appid=${apiKEY}`
    forecast.innerHTML = "";
    getWeather();
  }
  });

var dateNext = dayjs().add(1, 'day').format('dddd, MMMM D, YYYY h:mm A');
// var dateN = document.querySelector('#dateN');



// fetch api response and display data
function getWeather() {
    fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayWeather(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weather API');
    });
};
    
function displayWeather(data) {
  // displays all current weather data
    city.innerText = data.city.name;
    document.getElementById('iconCurrent').src = `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
    temp.innerText = `Temp: ${Math.round(data.list[0].main.temp)}° C`;
    humidity.innerText = `Humidity: ${Math.round(data.list[0].main.humidity)}%`;
    wind.innerText = `Wind: ${Math.round(data.list[0].wind.speed)} km/hr`;

    // displays 5 day forecast
    var forecast = document.getElementById('forecast');
    for (x=0; x<5; x++) {
        forecast.innerHTML += `
        <div class="day1">
                    <h3>Day ${x+1}</h3>
                    <p class="dateN">${dayjs().add(x, 'day').format('dddd, MMMM D')}</p>
                    <img src="http://openweathermap.org/img/w/${data.list[x].weather[0].icon}.png" alt="weather icon" class="iconDaily">
                    <p class="tempN">Temp: ${Math.round(data.list[x].main.temp)}° C</p>
                    <p class = "windN">Wind: ${Math.round(data.list[x].wind.speed)} km/hr</p>
                    <p class="humidityN">Humidity: ${Math.round(data.list[x].main.humidity)}%</p>
        </div>
        `;
        
    }
}

getWeather();
// Puts search history into local storage 
document.getElementById("search-button").addEventListener('click', () => {
  apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue.value}&units=metric&appid=${apiKEY}`
  forecast.innerHTML = "";
  getWeather();


  let strin = searchHistLocal.toString()
  if (strin.match(searchValue.value) == searchValue.value) {
    console.log("already in Local Storage");
  }
  else {
    // adds new search to begining of array and cuts off array items at 10
    searchHistLocal.unshift(searchValue.value);
    searchHistLocal.splice(10)
    localStorage.setItem("searchJSON", JSON.stringify(searchHistLocal));

    searchHistory.innerHTML =
    searchHistLocal.map(city => {
      return `<li class="cityBtn" id="${city}">${city}</li>`;
    }).join("");
  }
});

