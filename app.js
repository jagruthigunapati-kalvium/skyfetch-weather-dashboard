// WeatherApp Constructor
function WeatherApp(apiKey) {
    this.apiKey = apiKey;

    this.apiUrl =
        "https://api.openweathermap.org/data/2.5/weather";

    this.forecastUrl =
        "https://api.openweathermap.org/data/2.5/forecast";

    // DOM Elements
    this.searchBtn =
        document.getElementById("search-btn");

    this.cityInput =
        document.getElementById("city-input");

    this.weatherDisplay =
        document.getElementById("weather-display");

    // Initialize app
    this.init();
}

// INIT METHOD
WeatherApp.prototype.init = function () {

    this.searchBtn.addEventListener(
        "click",
        this.handleSearch.bind(this)
    );

    this.cityInput.addEventListener(
        "keypress",
        (event) => {
            if (event.key === "Enter") {
                this.handleSearch();
            }
        }
    );

    this.showWelcome();
};

// WELCOME MESSAGE
WeatherApp.prototype.showWelcome = function () {

    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌤 Welcome to SkyFetch</h2>
            <p>Search any city to see weather and forecast</p>
        </div>
    `;
};

// HANDLE SEARCH
WeatherApp.prototype.handleSearch = function () {

    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name");
        return;
    }

    if (city.length < 2) {
        this.showError("City name too short");
        return;
    }

    this.getWeather(city);

    this.cityInput.value = "";
};

// GET WEATHER
WeatherApp.prototype.getWeather = async function (city) {

    this.showLoading();

    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Searching...";

    const currentWeatherUrl =
        `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {

        const [currentWeather, forecastData] =
            await Promise.all([
                axios.get(currentWeatherUrl),
                this.getForecast(city)
            ]);

        this.displayWeather(currentWeather.data);

        this.displayForecast(forecastData);

    } catch (error) {

        console.error(error);

        if (
            error.response &&
            error.response.status === 404
        ) {
            this.showError(
                "City not found. Check spelling."
            );
        } else {
            this.showError(
                "Something went wrong."
            );
        }

    } finally {

        this.searchBtn.disabled = false;

        this.searchBtn.textContent =
            "🔍 Search";
    }
};

// GET FORECAST
WeatherApp.prototype.getForecast =
async function (city) {

    const url =
        `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {

        const response =
            await axios.get(url);

        return response.data;

    } catch (error) {

        console.error(
            "Forecast Error:",
            error
        );

        throw error;
    }
};

// DISPLAY CURRENT WEATHER
WeatherApp.prototype.displayWeather =
function (data) {

    const cityName = data.name;

    const temperature =
        Math.round(data.main.temp);

    const description =
        data.weather[0].description;

    const icon =
        data.weather[0].icon;

    const iconUrl =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">
                ${cityName}
            </h2>

            <img
                src="${iconUrl}"
                class="weather-icon"
            >

            <div class="temperature">
                ${temperature}°C
            </div>

            <p class="description">
                ${description}
            </p>
        </div>
    `;

    this.weatherDisplay.innerHTML =
        weatherHTML;

    this.cityInput.focus();
};

// PROCESS FORECAST DATA
WeatherApp.prototype.processForecastData =
function (data) {

    const dailyForecasts =
        data.list.filter(function (item) {

            return item.dt_txt.includes(
                "12:00:00"
            );
        });

    return dailyForecasts.slice(0, 5);
};

// DISPLAY FORECAST
WeatherApp.prototype.displayForecast =
function (data) {

    const dailyForecasts =
        this.processForecastData(data);

    const forecastHTML =
        dailyForecasts.map((day) => {

            const date =
                new Date(day.dt * 1000);

            const dayName =
                date.toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                );

            const temp =
                Math.round(day.main.temp);

            const description =
                day.weather[0].description;

            const icon =
                day.weather[0].icon;

            const iconUrl =
                `https://openweathermap.org/img/wn/${icon}@2x.png`;

            return `
                <div class="forecast-card">

                    <h4>${dayName}</h4>

                    <img
                        src="${iconUrl}"
                        class="forecast-icon"
                    >

                    <div class="forecast-temp">
                        ${temp}°C
                    </div>

                    <p class="forecast-description">
                        ${description}
                    </p>

                </div>
            `;
        }).join("");

    const forecastSection = `
        <div class="forecast-section">

            <h3 class="forecast-title">
                5-Day Forecast
            </h3>

            <div class="forecast-container">
                ${forecastHTML}
            </div>

        </div>
    `;

    this.weatherDisplay.innerHTML +=
        forecastSection;
};

// LOADING
WeatherApp.prototype.showLoading =
function () {

    this.weatherDisplay.innerHTML = `
        <div class="loading-container">

            <div class="spinner"></div>

            <p>Loading weather...</p>

        </div>
    `;
};

// ERROR
WeatherApp.prototype.showError =
function (message) {

    this.weatherDisplay.innerHTML = `
        <div class="error-message">

            <h3>❌ Error</h3>

            <p>${message}</p>

        </div>
    `;
};

// CREATE APP INSTANCE
const app =
    new WeatherApp("9a453b0c0c90d78e6f9f2b91a29e7924");