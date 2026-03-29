// weather-dashboard.js

const axios = require('axios');

const API_KEY = 'your_api_key_here'; // Replace with your actual API key

const getWeather = async (location) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

const getForecast = async (location) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
};

const getAnalytics = (data) => {
    const temperatures = data.list.map(entry => entry.main.temp);
    const averageTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    return { averageTemp };
};

const main = async () => {
    const location = 'London'; // You can change this to any location you want
    const weatherData = await getWeather(location);
    console.log('Current Weather:', weatherData);

    const forecastData = await getForecast(location);
    console.log('Forecast:', forecastData);

    const analytics = getAnalytics(forecastData);
    console.log('Analytics:', analytics);
};

main();