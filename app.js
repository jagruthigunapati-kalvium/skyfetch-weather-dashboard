const API_KEY = "9a453b0c0c90d78e6f9f2b91a29e7924";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

function getWeather(city) {
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    axios.get(url)
        .then(response => {
            displayWeather(response.data);
        })
        .catch(error => {
            document.getElementById("weather-display").innerHTML =
                "<p class='loading'>Failed to load weather</p>";
        });
}

function displayWeather(data) {
    const city = data.name;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById("weather-display").innerHTML = `
        <div>
            <h2 class="city-name">${city}</h2>
            <img class="weather-icon" src="${iconURL}" />
            <div class="temperature">${temp}°C</div>
            <p class="description">${desc}</p>
        </div>
    `;
}

// Default city
getWeather("London");