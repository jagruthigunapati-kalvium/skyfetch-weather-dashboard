const API_KEY = "9a453b0c0c90d78e6f9f2b91a29e7924";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

async function getWeather(city) {

    showLoading();

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    const url =
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {

        const response = await axios.get(url);

        console.log(response.data);

        displayWeather(response.data);

    } catch (error) {

        console.error(error);

        if (error.response && error.response.status === 404) {

            showError(
                "City not found. Please check spelling."
            );

        } else {

            showError(
                "Something went wrong. Try again later."
            );
        }

    } finally {

        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

function displayWeather(data) {

    const cityName = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    const iconURL =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById("weather-display").innerHTML = `

        <div class="weather-info">

            <h2 class="city-name">
                ${cityName}
            </h2>

            <img
                src="${iconURL}"
                class="weather-icon"
            >

            <div class="temperature">
                ${temp}°C
            </div>

            <p class="description">
                ${desc}
            </p>

        </div>
    `;

    cityInput.focus();
}

function showError(message) {

    document.getElementById("weather-display").innerHTML = `

        <div class="error-message">

            <h3>❌ Error</h3>

            <p>${message}</p>

        </div>
    `;
}

function showLoading() {

    document.getElementById("weather-display").innerHTML = `

        <div class="loading-container">

            <div class="spinner"></div>

            <p>Loading weather...</p>

        </div>
    `;
}

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (!city) {

        showError("Please enter a city name");
        return;
    }

    if (city.length < 2) {

        showError("City name too short");
        return;
    }

    getWeather(city);
});

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchBtn.click();
    }
});