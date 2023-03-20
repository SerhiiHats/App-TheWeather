const TIME_ZONE_OFF_SET = new Date().getTimezoneOffset() * 60 * 1000;

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


class City {
    #cityName = "";
    #localNames = "";
    #nameUserLike = "";
    #lat = "";
    #lon = "";
    #country = "";
    constructor(cityName, localNames, lat, lon, country) {
        this.#cityName = cityName;
        this.#localNames = localNames;
        this.#lat = lat;
        this.#lon = lon;
        this.#country = country;
    }

    get cityName() {
        return this.#cityName;
    }

    get localNames() {
        return this.#localNames;
    }

    get lat() {
        return this.#lat;
    }

    get lon() {
        return this.#lon;
    }

    get country() {
        return this.#country;
    }

    get nameUserLike() {
        return this.#nameUserLike;
    }

    set nameUserLike(value) {
        this.#nameUserLike = value;
    }
}

const storageUrl = [
    "http://api.openweathermap.org/geo/1.0/direct?q=Kyiv,UA&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5",
    "http://api.openweathermap.org/geo/1.0/direct?q=London,GB&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5",
    "http://api.openweathermap.org/geo/1.0/direct?q=New York,US&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5"
];

let storageCity = [];

const storageStartingOfCity = [{ cityName: "Kyiv", country: "UA", lat: 50.4500336, lon: 30.5241361, timezone_offset: 7200, }, { cityName: "London", country: "GB", lat: 51.5073219, lon: -0.1276474, timezone_offset: 0, }, { cityName: "New York County", country: "US", lat: 40.7127281, lon: -74.0060152, timezone_offset: -14400, }];

let repository = {
    //http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    //https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    //http://api.openweathermap.org/geo/1.0/direct?q=Kiev,UA&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5
    url: "https://api.openweathermap.org",
    apiKey: "cbcf4286e7eae1b583094a243e399ac5",
    cityName: "Kyiv",
    countryCode: "UA",
    current: "current",
    minutely: "minutely",
    hourly: "hourly",
    daily: "daily",
    alerts: "alerts",

    //http://api.openweathermap.org/geo/1.0/direct?q=Kyiv,UA&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5
    //http://api.openweathermap.org/geo/1.0/direct?q=London,GB&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5
    //http://api.openweathermap.org/geo/1.0/direct?q=New York,US&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5
    //https://api.openweathermap.org/data/3.0/onecall?lat=50.4500336&lon=30.5241361&exclude=hourly,daily&appid=cbcf4286e7eae1b583094a243e399ac5
    //https://api.openweathermap.org/data/3.0/onecall?lat=50.4500336&lon=30.5241361&exclude=minutely,hourly&appid=cbcf4286e7eae1b583094a243e399ac5
    // getAllWeather: function () {
    //     fetch(`${this.url}/geo/1.0/direct?q=${this.cityName},${this.countryCode}&limit=1&appid=${this.apiKey}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //             console.log(`lat : ${data[0].lat} , lon : ${data[0].lon}`)
    //             fetch(`${this.url}/data/3.0/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=${this.hourly},${this.daily}&appid=${this.apiKey}`)
    //                 .then(response => response.json())
    //                 .then(weather => {
    //                     document.querySelector("h3").textContent = this.cityName;
    //                     document.querySelector(".temperature").innerHTML = `${Math.round(weather.current.temp - 273.15)}&deg;`;
    //                     document.querySelector(".feel-like").innerHTML = `${Math.round(weather.current.feels_like - 273.15)}&deg;`;
    //                     document.querySelector(".humidily").textContent = `${weather.current.humidity}%`;
    //                     document.querySelector(".wind").textContent = `${weather.current.wind_speed} km/h`;
    //                     document.querySelector(".description").innerHTML = `${weather.current.weather[0].description} <img src=https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png alt=${weather.current.weather[0].description}>`;
    //                 })
    //         });
    // },

    getWeather: function (arrayOfCities) {
        for (let i = 0; i < arrayOfCities.length; i++) {
            fetch(`${this.url}/data/3.0/onecall?lat=${arrayOfCities[i].lat}&lon=${arrayOfCities[i].lon}&exclude=${this.minutely},${this.hourly}&appid=${this.apiKey}`)
                .then(response => response.json())
                .then(weather => {
                    document.querySelector("h3").textContent = arrayOfCities[i].cityName;
                    document.querySelector(".temperature").innerHTML = `${Math.round(weather.current.temp - 273.15)}&deg;`;
                    document.querySelector(".feel-like").innerHTML = `${Math.round(weather.current.feels_like - 273.15)}&deg;`;
                    document.querySelector(".humidily").textContent = `${weather.current.humidity}%`;
                    document.querySelector(".wind").textContent = `${weather.current.wind_speed} m/sec`;
                    document.querySelector(".left-view").innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png" alt="${weather.current.weather[0].description}" width="100%">`
                    document.querySelector(".temp-max").innerHTML = `${Math.round(weather.daily[0].temp.max - 273.15)}&deg;`;
                    document.querySelector(".temp-min").innerHTML = `${Math.round(weather.daily[0].temp.min - 273.15)}&deg;`;
                    document.querySelector(".description").textContent = weather.current.weather[0].description;
                    document.querySelector(".currently-time").textContent = getParseTime(getLocationDate(arrayOfCities[i].timezone_offset));
                    document.querySelector(".currently-date").textContent = getParseDate(getLocationDate(arrayOfCities[i].timezone_offset));

                    let timeId = setInterval(() => {
                        document.querySelector(".currently-time").textContent = getParseTime(getLocationDate(arrayOfCities[i].timezone_offset));
                    }, 1000);

                    let timeIdDate = setInterval(() => {
                        document.querySelector(".currently-date").textContent = getParseDate(getLocationDate(arrayOfCities[i].timezone_offset));
                    }, 1000);
                    const elementFutureWeather = document.querySelector(".future-weather");

                    const daily = weather.daily;
                    for (let x = 1; x < daily.length; x++) {
                        elementFutureWeather.innerHTML += `
                        <div>
                           <p>${getParseDay(new Date(daily[x].dt * 1000))}</p>
                           <img src="https://openweathermap.org/img/wn/${daily[x].weather[0].icon}@2x.png" alt="${daily[x].weather[0].description}" width="36px">
                           <p>Hi ${Math.round(daily[x].temp.max - 273.15)}&deg;</p>
                           <p>Lo ${Math.round(daily[x].temp.min - 273.15)}&deg;</p>
                        </div>`;
                    }
                })
        }
    },

    setFirstlyStorageCity: function () {

        for (let i = 0; i < storageUrl.length; i++) {
            fetch(storageUrl[i])
                .then(response => response.json())
                .then(city => {
                    storageCity[i] = new City(city[0].name, city[0].local_names, city[0].lat, city[0].lon, city[0].country);
                })
        }

        let timeId = setTimeout(() => {
            for (let i = 0; i < storageCity.length; i++) {
                console.log("позиция " + i + ", name:" + storageCity[i].cityName + ", country:" + storageCity[i].country + ", lat:" + storageCity[i].lat + ", lon:" + storageCity[i].lon);
                console.log(storageCity[i].localNames);
                console.log(storageCity[i].localNames['en']);
                console.log(storageCity[i].localNames['uk']);
                console.log(storageCity[i].localNames['ru']);
            }
        }, 3000);
    }
}

repository.setFirstlyStorageCity();

for (let i = 0; i < storageStartingOfCity.length; i++) {
    console.log("position" + i + " : " + storageStartingOfCity[i].cityName + ", lat:" + storageStartingOfCity[i].lat + ", lon:" + storageStartingOfCity[i].lon)
}

let oneCity = [];
oneCity.push(storageStartingOfCity[1]);
console.log(oneCity)
// repository.getWeather(oneCity);