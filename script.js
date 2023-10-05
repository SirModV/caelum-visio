document.addEventListener("DOMContentLoaded", () => {
    const locInput = document.querySelector("#locationInput");
    const locForm = document.querySelector("#locationForm");
    const resetHistoryButton = document.querySelector("#resetHistory");
    const forecastSection = document.querySelector("#fiveDayForecast");
    const searchHistorySection = document.querySelector("#searchedCities");

    let previousSearches = JSON.parse(localStorage.getItem("pastSearches")) || [];

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

            
        }
});