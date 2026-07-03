// ================= API KEY =================
const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key

// =============== DOM ELEMENTS ===============
const greeting = document.getElementById("greeting");
const today = document.getElementById("today");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const country = document.getElementById("country");
const time = document.getElementById("time");
const emoji = document.getElementById("emoji");
const forecast = document.getElementById("forecast");
const recentCities = document.getElementById("recentCities");
const logoutBtn = document.getElementById("logoutBtn");

// =============== LOGIN CHECK ===============
const loggedUser = localStorage.getItem("loggedInUser");

if (!loggedUser) {
    window.location.href = "index.html";
}

// =============== GREETING ===============
function updateGreeting() {
    const hour = new Date().getHours();

    if (hour < 12)
        greeting.innerHTML = `Good Morning, ${loggedUser} ☀️`;
    else if (hour < 17)
        greeting.innerHTML = `Good Afternoon, ${loggedUser} 🌤`;
    else
        greeting.innerHTML = `Good Evening, ${loggedUser} 🌙`;

    today.innerHTML = new Date().toDateString();
}

updateGreeting();

// =============== SEARCH ===============
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city !== "")
        getWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter")
        searchBtn.click();
});

// =============== WEATHER ===============
async function getWeather(city) {
    loader.style.display = "block";

    try {
        const weatherURL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`;

        const response = await fetch(weatherURL);
        const data = await response.json();

        if (data.error)
            throw new Error(data.error.message);

        displayWeather(data);
        displayForecast(data);
        saveRecent(city);
    }
    catch (err) {
        alert(err.message);
        console.error(err);
    }
    finally {
        loader.style.display = "none";
    }
}

// =============== DISPLAY CURRENT WEATHER ===============
function displayWeather(data) {
    cityName.innerHTML = `${data.location.name}, ${data.location.country}`;
    temperature.innerHTML = `${data.current.temp_c}°C`;
    description.innerHTML = data.current.condition.text;
    humidity.innerHTML = data.current.humidity + "%";
    wind.innerHTML = data.current.wind_kph + " km/h";
    country.innerHTML = data.location.country;
    time.innerHTML = data.location.localtime.split(" ")[1];
    emoji.innerHTML = getEmoji(data.current.condition.text.toLowerCase());
}

// =============== EMOJI ===============
function getEmoji(weather) {
    weather = weather.toLowerCase();

    if (weather.includes("sun"))
        return "☀️";
    if (weather.includes("cloud"))
        return "☁️";
    if (weather.includes("rain"))
        return "🌧️";
    if (weather.includes("snow"))
        return "❄️";
    if (weather.includes("mist"))
        return "🌫️";
    if (weather.includes("thunder"))
        return "⛈️";

    return "🌍";
}

// =============== BACKGROUND ===============
function changeTheme(weather) {
    document.body.className = "dashboard";

    if (weather.includes("clear"))
        document.body.classList.add("sunny");
    else if (weather.includes("cloud"))
        document.body.classList.add("cloudy");
    else if (weather.includes("rain"))
        document.body.classList.add("rainy");
    else if (weather.includes("snow"))
        document.body.classList.add("snowy");
    else
        document.body.classList.add("night");
}

// =============== FORECAST ===============
function displayForecast(data) {
    forecast.innerHTML = "";

    data.forecast.forecastday.forEach(day => {
        forecast.innerHTML += `
        <div class="forecast-card">
            <h3>${day.date}</h3>
            <h1>${getEmoji(day.day.condition.text.toLowerCase())}</h1>
            <p>${day.day.avgtemp_c}°C</p>
            <small>${day.day.condition.text}</small>
        </div>`;
    });
}

// =============== RECENT SEARCHES ===============
function saveRecent(city) {
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

    cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());
    cities.unshift(city);

    if (cities.length > 5)
        cities.pop();

    localStorage.setItem("recentCities", JSON.stringify(cities));
    loadRecent();
}

function loadRecent() {
    recentCities.innerHTML = "";

    const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

    cities.forEach(city => {
        const btn = document.createElement("button");
        btn.innerHTML = city;

        btn.onclick = () => {
            cityInput.value = city;
            getWeather(city);
        };

        recentCities.appendChild(btn);
    });
}

loadRecent();

// =============== LOGOUT ===============
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
});

// =============== DEFAULT CITY ===============
getWeather("Rajpura");