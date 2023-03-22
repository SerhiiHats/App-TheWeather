const TIME_ZONE_OFF_SET = new Date().getTimezoneOffset() * 60 * 1000;
const REQUEST_DELAY = 300000;
const storageUrl = [
    "http://api.openweathermap.org/geo/1.0/direct?q=Kyiv,UA&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5",
    "http://api.openweathermap.org/geo/1.0/direct?q=London,GB&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5",
    "http://api.openweathermap.org/geo/1.0/direct?q=New York,US&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5"
];
const storageStartingOfCity = [{ cityName: "Kyiv", country: "UA", lat: 50.4500336, lon: 30.5241361, timezone_offset: 7200, }, { cityName: "London", country: "GB", lat: 51.5073219, lon: -0.1276474, timezone_offset: 0, }, { cityName: "New York County", country: "US", lat: 40.7127281, lon: -74.0060152, timezone_offset: -14400, }];

function getLocationDate(timezone_offset) {
    return new Date(Date.now() + timezone_offset * 1000 + TIME_ZONE_OFF_SET);
}

function getParseTime(date) {
    const minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
    return `${date.getHours()}:${minute}`;
}

function getParseDate(date) {
    const ArrDate = date.toDateString().split(" ");
    return `${ArrDate[1]} ${ArrDate[2]} - ${ArrDate[3]} - ${ArrDate[0]}`;
}

function getParseDay(date) {
    const ArrDate = date.toDateString().split(" ");
    return ArrDate[0];
}

function setVerticalView() {
    let elementMain = document.querySelector("#main");
    elementMain.classList.remove("horison");
    elementMain.classList.add("vertical");
}

function setHorisonView() {
    let elementMain = document.querySelector("#main");
    elementMain.classList.remove("vertical");
    elementMain.classList.add("horison");
}

function removeCardWeather(event) {
    if (event.target.className !== "remove") {
        return;
    }
    const date = new Date();
    console.log(`${getParseTime(date)} ${getParseDate(date)} : елемент с class="card-weather" позиция в main и в массиве № ${event.target.parentElement.dataset.countCard} удален пользователем`);
    event.target.parentElement.remove();
}

let repository = {
    //http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    //https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    //http://api.openweathermap.org/geo/1.0/direct?q=Kiev,UA&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5    
    //https://api.openweathermap.org/data/3.0/onecall?lat=50.4500336&lon=30.5241361&exclude=minutely,hourly&appid=cbcf4286e7eae1b583094a243e399ac5

    url: "https://api.openweathermap.org",
    apiKey: "cbcf4286e7eae1b583094a243e399ac5",
    current: "current",
    minutely: "minutely",
    hourly: "hourly",
    daily: "daily",
    alerts: "alerts",
    arrayWeather: 0,
    getCurrentlyWeather: function () {
        let date = new Date();
        if (localStorage.storageLocalOfCity) {
            this.arrayWeather = JSON.parse(localStorage.storageLocalOfCity);
            console.log(`${getParseTime(date)} ${getParseDate(date)} : localStorage.storageLocalOfCity - найден! Обьктов в массиве=${this.arrayWeather.length} был распарсен`);
        } else {
            this.arrayWeather = storageStartingOfCity;
            console.log(`${getParseTime(date)} ${getParseDate(date)} : localStorage.storageLocalOfCity, не был найден! Применен стартовый storageStartingOfCity, обьктов в массиве=${this.arrayWeather.length}`);
        }

        this.getWeather(this.arrayWeather);
    },

    getWeather: function (arrayOfCities) {
        for (let i = 0; i < arrayOfCities.length; i++) {
            servicesView.createCardWeather(arrayOfCities[i].cityName, i);

            if (Date.now() - arrayOfCities[i].timeRequest < REQUEST_DELAY) {
                servicesView.fillCardWeather(arrayOfCities[i], i);
                let date = new Date();
                console.log(`${getParseTime(date)} ${getParseDate(date)} : Таймер=${Date.now() - arrayOfCities[i].timeRequest} < ${REQUEST_DELAY} = ${Date.now() - arrayOfCities[i].timeRequest < REQUEST_DELAY}. Карта погоды была создана из localStorage.storageLocalOfCity, для города=${this.arrayWeather[i].cityName}`);
            } else {
                fetch(`${this.url}/data/3.0/onecall?lat=${arrayOfCities[i].lat}&lon=${arrayOfCities[i].lon}&exclude=${this.minutely},${this.hourly}&appid=${this.apiKey}`)
                    .then(response => response.json())
                    .then(weather => {
                        let date = new Date();
                        console.log(`${getParseTime(date)} ${getParseDate(date)} : Таймер=${Date.now() - arrayOfCities[i].timeRequest} > ${REQUEST_DELAY} = ${Date.now() - arrayOfCities[i].timeRequest < REQUEST_DELAY}. Карта погоды со всемы данными была создана из ${this.url}, для города=${this.arrayWeather[i].cityName}`);
                        weather.cityName = arrayOfCities[i].cityName;
                        weather.country = arrayOfCities[i].country;
                        weather.timeRequest = Date.now();
                        this.arrayWeather[i] = weather;
                        localStorage.setItem("storageLocalOfCity", JSON.stringify(this.arrayWeather));
                        servicesView.fillCardWeather(this.arrayWeather[i], i);
                    });
            }
        }
    },
}

class ServicesView {
    createCardWeather(cityName, index) {
        let elementCardWeather = document.createElement("div");
        elementCardWeather.className = "card-weather";
        elementCardWeather.setAttribute("data-count-card", index);
        elementCardWeather.innerHTML = `
        <span class="remove">x</span>
        <h3>${cityName}</h3>
        <div class="front-view"></div>
        <div class="future-weather"></div>
        <div class="footer-card">Weather</div>`;
        document.querySelector(".container-weathers").append(elementCardWeather);
    }

    fillCardWeather(weather, index) {
        let elementFrontView = document.querySelector(`[data-count-card="${index}"] .front-view`);
        elementFrontView.insertAdjacentHTML("afterbegin", `
        <div class="left-view">
        <img src='https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png' alt="${weather.current.weather[0].description}" width='100%'>
        </div>
        <div class="right-view">
            <p class="currently-date">${getParseDate(getLocationDate(weather.timezone_offset))}</p>    <!-- arrayOfCities[index].timezone_offset -->
            <p class="currently-time">${getParseTime(getLocationDate(weather.timezone_offset))}</p>    <!-- weather.timezone_offset -->
            <div class="container-temperature">
                <div class="left-view-temperature">
                    <p class="temperature">${Math.round(weather.current.temp - 273.15)}&deg;</p>
                    <p>Hi <span class="temp-max">${Math.round(weather.daily[0].temp.max - 273.15)}&deg;</span></p>
                    <p>Lo <span class="temp-min">${Math.round(weather.daily[0].temp.min - 273.15)}&deg;</span></p>
                </div>
                <div class="right-view-temperature">
                    <p>Feel like : <span class="feel-like">${Math.round(weather.current.feels_like - 273.15)}&deg;</span></p>
                    <p>Humidily : <span class="humidily">${weather.current.humidity}%</span></p>
                    <p>wind : <span class="wind">${weather.current.wind_speed} m/sec</span></p>
                </div>
            </div>
        </div>
        `);

        elementFrontView.insertAdjacentHTML("afterend", `<p class="description">${weather.current.weather[0].description}</p>`);

        const daily = weather.daily;

        for (let x = 1; x < daily.length; x++) {
            let elementFuturedWeather = document.createElement("div");
            elementFuturedWeather.innerHTML = `
            <p>${getParseDay(new Date(daily[x].dt * 1000))}</p>
            <img src='https://openweathermap.org/img/wn/${daily[x].weather[0].icon}@2x.png' alt="${daily[x].weather[0].description}" width='36px'>
            <p>Hi ${Math.round(daily[x].temp.max - 273.15)}&deg;</p>
            <p>Lo ${Math.round(daily[x].temp.min - 273.15)}&deg;</p>`;
            document.querySelector(`[data-count-card="${index}"] .future-weather`).append(elementFuturedWeather);
        }

        let timeId = setInterval(() => {
            let elementTime = document.querySelector(`[data-count-card="${index}"] .currently-time`);
            if (elementTime) {
                elementTime.textContent = getParseTime(getLocationDate(weather.timezone_offset));
            } else {
                timeId = null;
            }
        }, 1000);

        let timeIdDate = setInterval(() => {
            let elementDate = document.querySelector(`[data-count-card="${index}"] .currently-date`);
            if (elementDate) {
                elementDate.textContent = getParseDate(getLocationDate(weather.timezone_offset));
            } else {
                timeIdDate = null;
            }
        }, 1000);
    }
}

function setDefaultSettings() {
    localStorage.removeItem("storageLocalOfCity");
    let date = new Date();
    console.log(`${getParseTime(date)} ${getParseDate(date)} : localStorage.storageLocalOfCity - был удален пользователем, настройки приведены в первоначальное состояние`);
    document.querySelector(".container-weathers").textContent = "";
    repository.getCurrentlyWeather();
}

document.querySelector("#horison").addEventListener("click", setHorisonView);
document.querySelector("#vertical").addEventListener("click", setVerticalView);
document.querySelector("#default").addEventListener("click", setDefaultSettings);
document.querySelector("#main").addEventListener("click", removeCardWeather);

let servicesView = new ServicesView();
repository.getCurrentlyWeather();
