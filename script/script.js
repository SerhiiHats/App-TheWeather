function getTimeNow() {
    const time = new Date();
    const minute = (time.getMinutes() < 10) ? `0${time.getMinutes()}` : time.getMinutes();
    return `${time.getHours()}:${minute}`;
}

function getDateNow() {
    const ArrDate = new Date().toDateString().split(" ");
    return `${ArrDate[1]} ${ArrDate[2]} - ${ArrDate[3]} - ${ArrDate[0]}`;
}
let timeId = setInterval(() => {
    document.querySelector(".currently-time").textContent = getTimeNow();
}, 1000);

let timeIdDate = setInterval(() => {
    document.querySelector(".currently-date").textContent = getDateNow();
}, 1000)

let repository = {
    //http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    //https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    //http://api.openweathermap.org/geo/1.0/direct?q=Kiev,UA&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5
    url: "https://api.openweathermap.org",
    apiKey: "cbcf4286e7eae1b583094a243e399ac5",
    cityName: "Kyiv",
    countryCode: "UA",
    current: "current",
    hourly: "hourly",
    daily: "daily",

    //http://api.openweathermap.org/geo/1.0/direct?q=Kyiv,UA&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5
    getWeather: function () {
        fetch(`${this.url}/geo/1.0/direct?q=${this.cityName},${this.countryCode}&limit=1&appid=${this.apiKey}`)
// fetch("http://api.openweathermap.org/geo/1.0/direct?q=Kyiv,UA&limit=1&appid=cbcf4286e7eae1b583094a243e399ac5")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(`lat : ${data[0].lat} , lon : ${data[0].lon}`)
                fetch(`${this.url}/data/3.0/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=${this.hourly},${this.daily}&appid=${this.apiKey}`)
                //https://api.openweathermap.org/data/3.0/onecall?lat=50.4500336&lon=30.5241361&exclude=hourly,daily&appid=cbcf4286e7eae1b583094a243e399ac5
                    .then(response => response.json())
                    .then(weather => {
                        console.log(weather);
                        console.log("temp kelvin: " + weather.current.temp + ", temp celsius: " + (weather.current.temp - 273.15));
                        console.log("feels_like temp kelvin: " + weather.current.feels_like + ", temp celsius: " + (weather.current.feels_like - 273.15));
                        console.log("humidity: " + weather.current.humidity + " %");
                        console.log("wind: " + weather.current.wind_speed + " km/h");
                        console.log("description: " + weather.current.weather[0].description);
                        console.log("icon: " + weather.current.weather[0].icon);
                        console.log("timezone: " + weather.timezone);
                    })
                
            });
    }
}

repository.getWeather();