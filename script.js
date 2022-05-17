'use strict';
const apiKey = 'bdf0ae9272917e82b9b2fae7daa04027';
const apiKey2 = '44377d8dacb98f92190a76fe1a5db5d8';
const btnSearch = document.querySelector('.search_button');
const serachInput = document.querySelector('.search_bar');
const labelCity = document.querySelector('.city');
const labelTemp = document.querySelector('.temperature');
const labelDescription = document.querySelector('.weather_description');
const labelHumidity = document.querySelector('.humidity');
const labelWind = document.querySelector('.wind_speed');
const labelIcon = document.querySelector('img');
const card = document.querySelector('.card');
const cardOverlay = document.querySelector('.card_overlay');
const cardFront = document.querySelector('.card_front');
const cardBack = document.querySelector('.card_back');
const btnRotate = document.querySelectorAll('.button_more');
const weekdays = document.querySelectorAll('.day');
const weekdaysTemp = document.querySelectorAll('.dayTemp');
const week = document.querySelectorAll('.weekday');
const dayImgs = document.querySelectorAll('.day__img');
const forecastBox = document.querySelector('.daily__forecast');
const forecastOverlay = document.querySelector('.forecast__overlay ');
const dayArr = [];
let click = true;

//Function for geo LOCATION
function getLocation() {
  return new Promise((reslove, reject) => {
    navigator.geolocation.getCurrentPosition(reslove, reject);
  });
}

//Calculating Starting Location when page Loads
async function startingLocation() {
  try {
    const location = await getLocation();
    const { latitude: lat, longitude: lng } = location.coords;
    const getCity = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    const city = await getCity.json();
    fetchWeather(city.city);
    eigthDayForecast(city.city, 'current');
    labelIcon.classList.remove('hidden');
  } catch (err) {
    console.error(err.message);
  }
}

//Weather function

async function fetchWeather(city) {
  try {
    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!weather.ok) throw new Error('Something went wrong');
    const cityWeather = await weather.json();

    RenderWeather(cityWeather);
    forecastBox.innerHTML = '';
    eigthDayForecast(city, 'current');

    //City name
  } catch (error) {
    console.error(error.message);
  }
}

window.addEventListener('load', function () {
  startingLocation();
});

//Render Weather on front card
function RenderWeather(city) {
  //Name of city
  labelCity.textContent = `Current forecast for ${city.name}, ${city.sys.country}`;
  //Temperature
  labelTemp.textContent = `${Math.trunc(city.main.temp)}°C`;
  //Icon
  labelIcon.src = `http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`;
  //Description
  labelDescription.textContent = `${city.weather[0].main}`;
  //Humidity
  labelHumidity.textContent = `Humidity: ${city.main.humidity} %`;
  //Wind
  labelWind.textContent = `Wind speed: ${city.wind.speed} km/h`;
}

//

function showForecast(e) {
  forecastBox.classList.remove('opacity');
  cardFront.style.opacity = 0.1;
  const targetIndex = e.target.querySelector('.day').dataset.id;
  forecastBox.innerHTML = '';
  renderForecast(dayArr[targetIndex]);
}
function hideForecast(e) {
  cardFront.style.opacity = 0.7;
  forecastBox.classList.add('opacity');
}
//When hovering over days on card-side-back
function renderForecast(data) {
  const transfromDate = function (date) {
    const makingDate = new Date(date * 1000);

    return new Intl.DateTimeFormat(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
    }).format(makingDate);
  };

  const sunrise = transfromDate(data.sunrise);
  const sunset = transfromDate(data.sunset);
  const html = ` <div class="days">
  <div class="sun">
  <div class="sunrise">
<i class="ph-arrow-up"></i>
<i class="ph-sun-horizon"></i>
<p class="sunrise">${sunrise}</p>
  </div>
  <div class="sunset">
<i class="ph-arrow-down"></i>
<i class="ph-sun-horizon"></i>
<p class="sunset">${sunset}</p>
  </div>
  </div>
  <div class="daily__feelsLike">
    <table align="left">
    <tbody>
      <tr>
            <td>Morning</td>
            <td>Afternoon</td>
          <td>Evening</td>
          <td>Night</td>
        </tr>
      <tr>           
            <td>${Math.floor(data.temp.morn)}°C</td>
            <td>${Math.floor(data.temp.day)}°C</td>
          <td>${Math.floor(data.temp.eve)}°C</td>
          <td>${Math.floor(data.temp.night)}°C</td>
        </tr>
    </tbody>
</table>
  </div>
  <div class="daily__description">
    <p class="daily _humidity">Humidtiy : ${data.humidity}%</p>
    <p class="daily _clouds">Chance for clouds : ${data.clouds}%</p>
    <p class="daily _rain">Rain volume : ${
      !data.rain ? '/' : data.rain + ' ' + 'mm'
    }</p>
    <p class="daily __pressure">Air preassure : ${data.pressure} hPa</p>
    <p class="daily __pressure">Wind speed : ${data.wind_speed}km/h</p>
  </div>
</div>`;

  document
    .querySelector('.daily__forecast')
    .insertAdjacentHTML('afterbegin', html);
}

async function eigthDayForecast(city, exclude) {
  const cityCoords = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  );

  const [town] = await cityCoords.json();
  const { lat, lon } = town;

  const nextDays = await fetch(
    ` https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=metric`
  );
  if (!nextDays.ok) throw new Error('City not found');
  const day = await nextDays.json();
  //Looping over APPI
  for (let i = 0; i < day.daily.length; i++) {
    //Icon from API
    const icon = day.daily[i].weather[0].icon;
    //Setting src for IMAGE
    dayImgs[i].src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    //Date
    const date = new Date(day.daily[i].dt * 1000);
    //Day of week
    const weekDay = new Intl.DateTimeFormat(navigator.language, {
      weekday: 'short',
      day: 'numeric',
    }).format(date);
    //day.daily for forecastRender pushing
    dayArr.push(day.daily[i]);
    //Rendering text content of weekday
    weekdays[i].textContent = `${weekDay}`;

    weekdaysTemp[i].textContent = `${Math.floor(
      day.daily[i].temp.min
    )}/${Math.floor(day.daily[i].temp.max)}°C`;
  }
}

function lodaWeather() {
  fetchWeather(serachInput.value);
  serachInput.blur();
  serachInput.value = '';
  serachInput.focus();
}

//LOGIC

//Button search
btnSearch.addEventListener('click', function (e) {
  if (!serachInput.value) {
    console.error('Empty input');
    return;
  }
  lodaWeather();
});

serachInput.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  lodaWeather();
});

//Button click for more. Rotate card in each location
btnRotate.forEach(btn => {
  btn.addEventListener('click', function (e) {
    if (click) {
      card.classList.add('rotate');
      card.classList.remove('rotate_back');

      setTimeout(() => (click = false), 1500);
    } else {
      card.classList.add('rotate_back');
      card.classList.remove('rotate');
      setTimeout(() => (click = true), 1500);
    }
  });
});
//Weeekday evenets

week.forEach(day => {
  day.addEventListener('mouseenter', showForecast);
  day.addEventListener('mouseleave', hideForecast);
});
