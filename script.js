document.addEventListener("DOMContentLoaded", () => {
    const locInput = document.querySelector("#locationInput");
    const locForm = document.querySelector("#locationForm");
    const resetHistoryButton = document.querySelector("#resetHistory");
    const forecastSection = document.querySelector("#fiveDayForecast");
    const searchHistorySection = document.querySelector("#searchedCities");

    let previousSearches = JSON.parse(localStorage.getItem("pastSearches")) || [];

    const displayPastSearches = () => {
        searchHistorySection.innerHTML = "";
        previousSearches.forEach(city => {
            let cityBtn = document.createElement("button");
            cityBtn.textContent = city;
            cityBtn.addEventListener("click", () => fetchWeather(city));
            searchHistorySection.appendChild(cityBtn);
        });
    }

    const fetchWeather = (city) => {
        const YOUR_API_KEY = "64f5fc3e4fc1416d3145cf9ffa546fed"; 

        // Endpoint for current weather
        const currentWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${YOUR_API_KEY}`;

        fetch(currentWeatherEndpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error fetching current weather.");
                }
                return response.json();
            })
            .then(data => {
                document.querySelector("#description").textContent = `Currently, ${data.name} is experiencing ${data.weather[0].description}.`;
                document.querySelector("#temp").textContent = `Temperature: ${((data.main.temp - 273.15) * 1.8 + 32).toFixed(2)}°F`;

                const iconElement = document.querySelector("#weatherIcon");
                iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
                iconElement.alt = data.weather[0].description;

                document.querySelector("#wind").textContent = `Wind Speed: ${(data.wind.speed * 2.237).toFixed(2)} mph`;
                document.querySelector("#humidity").textContent = `Humidity: ${data.main.humidity}%`;

                // Add to search history
                if (!previousSearches.includes(data.name)) {
                    previousSearches.push(data.name);
                    localStorage.setItem("pastSearches", JSON.stringify(previousSearches));
                    displayPastSearches();
                }

                // Fetch the forecast data
                const forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${YOUR_API_KEY}`;

                return fetch(forecastEndpoint);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error fetching forecast data.");
                }
                return response.json();
            })
            .then(data => {
                forecastSection.innerHTML = ""; // Clearing any previous forecasts

               
                for (let i = 0; i < data.list.length; i += 8) {
                    const forecastData = data.list[i];
                    const date = new Date(forecastData.dt * 1000).toLocaleDateString("en-US", { weekday: 'long' });

                    const forecastDiv = document.createElement("div");
                    forecastDiv.innerHTML = `
                        <strong>${date}</strong> <br>
                        ${forecastData.weather[0].description} <br>
                        Temp: ${((forecastData.main.temp - 273.15) * 1.8 + 32).toFixed(2)}°F <br>
                    `;

                    forecastSection.appendChild(forecastDiv);
                }
            })
            .catch(error => {
                console.error("There was an error fetching weather data:", error);
            });
    }

    locForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const city = locInput.value.trim();
        if (city) fetchWeather(city);
        locInput.value = "";
    });

    resetHistoryButton.addEventListener("click", () => {
        localStorage.removeItem("pastSearches");
        previousSearches = [];
        displayPastSearches();
    });

    displayPastSearches();
});
