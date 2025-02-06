const CITY = "Nashik";
const API_KEY = `580cb0981ce9a294a111aa2343a073b1`;
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

// Map OpenWeatherMap icon codes to local images
const weatherImageMap = {
  "01d": "clearsky.png",
  "01n": "clearskynight.png",
  "02d": "fewclouds.png",
  "02n": "fcn.png",
  "03d": "scatteredclouds.png",
  "03n": "scatteredclouds.png",
  "09d": "rain.png",
  "09n": "rain.png",
  "10d": "heavyrain.png",
  "10n": "heavyrain.png",
  "13d": "snow.png",
  "13n": "snow.png",
  "50d": "mist.png",
  "50n": "mist.png"
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning!";
  if (hour < 18) return "Good Afternoon!";
  return "Good Night!";
}

async function fetchWeatherData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.cod !== 200) {
      document.getElementById("advice").textContent = "Failed to fetch weather data.";
      return;
    }

    // Update Weather Details
    document.getElementById("weather-condition").textContent = data.weather[0].description;
    document.getElementById("temperature").textContent = `${data.main.temp}°C`;
    document.querySelector(".location").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;

    // Update UV Index (Mock value)
    const uvIndex = Math.random() * 10;
    document.getElementById("uv-index").textContent = uvIndex.toFixed(1);

    // Estimate Rainfall Probability (No OpenWeatherMap `pop`)
    const humidity = data.main.humidity;
    const cloudiness = data.clouds.all;
    const estimatedRainfallProbability = Math.min((humidity * 0.5) + (cloudiness * 0.5), 100);

    document.getElementById("rainfall-chances").textContent = `${estimatedRainfallProbability.toFixed(0)}%`;
    document.getElementById("rainfall-bar").style.width = `${estimatedRainfallProbability}%`;

    // Update Advice
    const advice = estimatedRainfallProbability > 50
      ? "Rainfall is likely today—plan your crop irrigation accordingly! 🌧️"
      : "Rainfall is unlikely today—ensure your crops stay hydrated by watering them promptly. 🌱";
    document.getElementById("advice").textContent = advice;

    // Dynamic Weather Icon (Local Image)
    const weatherIcon = data.weather[0].icon;
    const localImage = weatherImageMap[weatherIcon] || "images/default.png"; // Fallback to default image
    document.getElementById("weather-icon").src = localImage;

  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("advice").textContent = "Error fetching weather data.";
  }
}

function setupHamburgerMenu() {
  const menuSlider = document.getElementById("menu-slider");
  const overlay = document.getElementById("overlay");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const closeBtn = document.getElementById("close-btn");

  hamburgerMenu.addEventListener("click", () => {
    menuSlider.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    menuSlider.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    menuSlider.classList.remove("active");
    overlay.classList.remove("active");
  });
}

// Initialize the page
document.getElementById("greeting").textContent = getGreeting();
fetchWeatherData();
setupHamburgerMenu();
