const getWeatherBtn = document.getElementById("get-weather-btn")
const locationElement = document.getElementById("location");
const mainTemperatureElement = document.getElementById("main-temperature");
const feelsLikeElement = document.getElementById("feels-like");
const weatherIconElement = document.getElementById("weather-icon");
const weatherMainElement = document.getElementById("weather-main");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const windGustElement = document.getElementById("wind-gust");
const citySelect = document.getElementById("city-select");
const arrow = document.getElementById("arrow");
const weatherInfo = document.getElementById("weather-info");



     

async function getWeather(city) {
   try { 
    let response = await fetch(`https://weather-proxy.freecodecamp.rocks/api/city/${city}`);
    let weatherData = await response.json();
    
    return weatherData

}
catch (error) {
    console.log("Error fetching city data:", error);
    return null;
  }
}

async function showWeather(city) {
    const weatherData = await getWeather(city);

    if(!weatherData) {
        alert("Something went wrong, please try again later");
        return;
    }      

  
    const location = weatherData.name ?? "N/A";
    const temp = weatherData.main.temp ?? "N/A";
    const description = weatherData.weather[0].main ?? "N/A";
    const longDescription = weatherData.weather[0].description ?? "N/A";
    const icon = weatherData.weather[0].icon ?? "";
    const feels = weatherData.main.feels_like ?? "N/A";
    const humidity = weatherData.main.humidity ?? "N/A";
    const windSpeed = weatherData.wind.speed ?? "N/A";
    const windGust = weatherData.wind.gust ?? "N/A";
    const windDirection = weatherData.wind.deg ?? "N/A";

    arrow.style.transform = `rotate(${windDirection}deg)`
   
    locationElement.innerText = location;
    mainTemperatureElement.innerText = temp !== "N/A" ? `Temperature: ${temp}°` : "N/A";
    feelsLikeElement.innerText = feels !== "N/A" ? `Feels like: ${feels}°` : "Feels like: N/A";
    weatherIconElement.src = icon;
    weatherMainElement.innerText = description;
    humidityElement.innerText = humidity !== "N/A" ? `Humidity: ${humidity}%` : "Humidity: N/A";
    windElement.innerText = windSpeed !== "N/A" ? `Wind: ${windSpeed} m/s` : "Wind: N/A";
    windGustElement.innerText = windGust !== "N/A" ? `Gusts: ${windGust} m/s` : "Gusts: N/A";
}


getWeatherBtn.addEventListener("click", async () => {
    const city = citySelect.value;
    await showWeather(city);
    weatherInfo.style.display = "flex"
});
