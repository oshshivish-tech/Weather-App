const API_KEY = "e75305b5588542bab2c50126260904";
const BASE_URL = "http://api.weatherapi.com/v1/current.json";

const locationInput = document.getElementById('location-input');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');

// Weather DOM elements
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const locationName = document.getElementById('location-name');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

async function getWeather() {
    const location = locationInput.value.trim();
    
    if (!location) {
        return;
    }

    // Update UI state
    weatherResult.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`);
        
        if (!response.ok) {
            throw new Error('Location not found');
        }

        const data = await response.json();
        
        // Update DOM with weather data
        // Weatherapi returns icon URL without protocol (e.g. //cdn.weatherapi...), need to prepend https:
        const iconUrl = data.current.condition.icon.startsWith('//') ? 'https:' + data.current.condition.icon : data.current.condition.icon;
        
        weatherIcon.src = iconUrl;
        weatherIcon.alt = data.current.condition.text;
        
        temperature.innerHTML = `${Math.round(data.current.temp_c)}&deg;C`;
        condition.textContent = data.current.condition.text;
        locationName.textContent = `${data.location.name}, ${data.location.country}`;
        humidity.textContent = `${data.current.humidity}%`;
        windSpeed.textContent = `${data.current.wind_kph} km/h`;

        // Wait a small moment to let image try to load, then show
        setTimeout(() => {
            loading.classList.add('hidden');
            weatherResult.classList.remove('hidden');
        }, 300);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        loading.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}
