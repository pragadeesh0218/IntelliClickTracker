import axios from "axios";
import { CurrentWeather, ForecastData, DailyForecast } from "@/types";
import { getCityById } from "./citiesController";

// Get OpenWeatherMap API key from environment variables
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(cityId: string): Promise<CurrentWeather> {
  try {
    // First get city details to get coordinates
    const city = await getCityById(cityId);
    
    if (!city) {
      throw new Error("City not found");
    }
    
    // Make API call to OpenWeatherMap using coordinates
    const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
      params: {
        lat: city.coordinates.lat,
        lon: city.coordinates.lon,
        appid: WEATHER_API_KEY,
        units: "metric" // Use metric units by default
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching current weather for city ID ${cityId}:`, error);
    throw new Error("Failed to fetch current weather data");
  }
}

export async function getWeatherForecast(cityId: string): Promise<{ daily: DailyForecast[] }> {
  try {
    // First get city details to get coordinates
    const city = await getCityById(cityId);
    
    if (!city) {
      throw new Error("City not found");
    }
    
    // Get 5-day forecast with 3-hour intervals
    const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast`, {
      params: {
        lat: city.coordinates.lat,
        lon: city.coordinates.lon,
        appid: WEATHER_API_KEY,
        units: "metric" // Use metric units by default
      }
    });
    
    const forecastData: ForecastData = response.data;
    
    // Process the forecast data to get daily forecasts
    const dailyForecasts = processForecastData(forecastData);
    
    return { daily: dailyForecasts };
  } catch (error) {
    console.error(`Error fetching weather forecast for city ID ${cityId}:`, error);
    throw new Error("Failed to fetch weather forecast data");
  }
}

export async function getWeatherSummary(cityId: string): Promise<{ main: string; description: string; temp: number; temp_min: number; temp_max: number; icon: string; }> {
  try {
    const currentWeather = await getCurrentWeather(cityId);
    
    return {
      main: currentWeather.weather[0].main,
      description: currentWeather.weather[0].description,
      temp: currentWeather.main.temp,
      temp_min: currentWeather.main.temp_min,
      temp_max: currentWeather.main.temp_max,
      icon: currentWeather.weather[0].icon
    };
  } catch (error) {
    console.error(`Error fetching weather summary for city ID ${cityId}:`, error);
    throw new Error("Failed to fetch weather summary");
  }
}

// Helper function to process forecast data into daily forecasts
function processForecastData(forecastData: ForecastData): DailyForecast[] {
  const dailyData: { [date: string]: DailyForecast } = {};
  
  // Process the 3-hour interval forecasts into daily forecasts
  forecastData.list.forEach(forecast => {
    const date = forecast.dt_txt.split(' ')[0]; // Extract the date part
    
    if (!dailyData[date]) {
      // Initialize data for this day
      dailyData[date] = {
        date,
        dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        temp_max: forecast.main.temp_max,
        temp_min: forecast.main.temp_min,
        weather: {
          main: forecast.weather[0].main,
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon
        },
        pop: forecast.pop, // Probability of precipitation
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed
      };
    } else {
      // Update max/min temperatures
      if (forecast.main.temp_max > dailyData[date].temp_max) {
        dailyData[date].temp_max = forecast.main.temp_max;
      }
      if (forecast.main.temp_min < dailyData[date].temp_min) {
        dailyData[date].temp_min = forecast.main.temp_min;
      }
      
      // Average out other values (simple approach)
      dailyData[date].pop = (dailyData[date].pop + forecast.pop) / 2;
      dailyData[date].humidity = (dailyData[date].humidity + forecast.main.humidity) / 2;
      dailyData[date].wind = (dailyData[date].wind + forecast.wind.speed) / 2;
    }
  });
  
  // Convert to array and sort by date
  return Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
