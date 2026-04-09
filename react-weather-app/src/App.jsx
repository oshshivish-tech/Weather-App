import { useState } from 'react';

const API_KEY = "e75305b5588542bab2c50126260904";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getWeather = async () => {
    const loc = location.trim();
    if (!loc) return;

    setWeatherData(null);
    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(loc)}&aqi=yes`);
      
      if (!response.ok) {
        throw new Error('Location not found');
      }

      const data = await response.json();
      
      // Simulate small delay for fade in similar to original App
      setTimeout(() => {
        setWeatherData(data);
        setLoading(false);
      }, 300);

    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(true);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  return (
    <div className="app-container">
      <div className="weather-card">
        <header>
          <h1>Weather</h1>
        </header>

        <div className="search-box">
          <i className="fa-solid fa-location-dot"></i>
          <input 
            type="text" 
            placeholder="Enter location..." 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={getWeather}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {weatherData && !loading && !error && (
          <div className="weather-result">
            <div className="weather-main">
              <img 
                src={weatherData.current.condition.icon.startsWith('//') ? 'https:' + weatherData.current.condition.icon : weatherData.current.condition.icon} 
                alt={weatherData.current.condition.text} 
                className="weather-icon" 
              />
              <h2 className="temperature">{Math.round(weatherData.current.temp_c)}&deg;C</h2>
              <p className="condition">{weatherData.current.condition.text}</p>
              <p className="location-name">{weatherData.location.name}, {weatherData.location.country}</p>
            </div>

            <div className="weather-details">
              <div className="detail-card">
                <i className="fa-solid fa-droplet"></i>
                <div>
                  <p className="detail-value">{weatherData.current.humidity}%</p>
                  <p className="detail-label">Humidity</p>
                </div>
              </div>
              <div className="detail-card">
                <i className="fa-solid fa-wind"></i>
                <div>
                  <p className="detail-value">{weatherData.current.wind_kph} km/h</p>
                  <p className="detail-label">Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="error-message">
            <p>Location not found. Please try again.</p>
          </div>
        )}

        {loading && (
          <div className="loading">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
