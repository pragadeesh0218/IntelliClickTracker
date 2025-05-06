import axios from "axios";
import { City, CitySearchResult, CurrentWeather, ForecastData, DailyForecast } from "@/types";
import { db } from "@db";
import { favorites } from "@shared/schema";
import { eq } from "drizzle-orm";

// OpenWeatherMap API configuration
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "9315eb1395ee2436086bfa4922c5b53f";
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Cities API configuration
const CITIES_API_URL = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records";

// CITIES CONTROLLER FUNCTIONS

export async function searchCities(query: string, limit: number = 10): Promise<City[]> {
  try {
    const response = await axios.get(CITIES_API_URL, {
      params: {
        where: `name:*${query}*`,
        limit,
        sort: "population DESC"
      }
    });

    const data = response.data;
    
    // Map the response to our City interface
    return data.results.map((result: any) => ({
      id: result.geoname_id.toString(),
      name: result.name,
      cou_name_en: result.cou_name_en,
      timezone: result.timezone,
      population: result.population,
      coordinates: {
        lat: result.coordinates.lat,
        lon: result.coordinates.lon
      }
    }));
  } catch (error) {
    console.error("Error searching cities:", error);
    throw new Error("Failed to search cities");
  }
}

export async function getCities(
  page: number = 1, 
  limit: number = 20, 
  sortBy: string = "name", 
  sortOrder: "asc" | "desc" = "asc",
  continent: string = "all"
): Promise<{ cities: City[], hasNext: boolean }> {
  try {
    const offset = (page - 1) * limit;
    
    let whereClause = "";
    if (continent !== "all") {
      whereClause = `&where=continent:"${continent}"`;
    }
    
    const response = await axios.get(
      `${CITIES_API_URL}?limit=${limit}&offset=${offset}&sort=${sortBy} ${sortOrder}${whereClause}`
    );
    
    const data = response.data;
    
    // Map the response to our City interface
    const cities = data.results.map((result: any) => ({
      id: result.geoname_id.toString(),
      name: result.name,
      cou_name_en: result.cou_name_en,
      timezone: result.timezone,
      population: result.population,
      coordinates: {
        lat: result.coordinates.lat,
        lon: result.coordinates.lon
      }
    }));
    
    // Determine if there are more cities to fetch
    const hasNext = data.total_count > (offset + limit);
    
    return { cities, hasNext };
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw new Error("Failed to fetch cities");
  }
}

export async function getCityById(id: string): Promise<City | null> {
  try {
    const response = await axios.get(CITIES_API_URL, {
      params: {
        where: `geoname_id:${id}`,
        limit: 1
      }
    });
    
    const data = response.data;
    
    if (data.results.length === 0) {
      return null;
    }
    
    const result = data.results[0];
    
    return {
      id: result.geoname_id.toString(),
      name: result.name,
      cou_name_en: result.cou_name_en,
      timezone: result.timezone,
      population: result.population,
      coordinates: {
        lat: result.coordinates.lat,
        lon: result.coordinates.lon
      }
    };
  } catch (error) {
    console.error(`Error fetching city with ID ${id}:`, error);
    throw new Error("Failed to fetch city details");
  }
}

export async function toggleFavorite(cityId: string, cityName: string, countryName: string): Promise<boolean> {
  try {
    // Check if city is already a favorite
    const existingFavorite = await db.query.favorites.findFirst({
      where: eq(favorites.cityId, cityId)
    });
    
    if (existingFavorite) {
      // Remove from favorites
      await db.delete(favorites).where(eq(favorites.cityId, cityId));
      return false; // Not a favorite anymore
    } else {
      // Add to favorites
      await db.insert(favorites).values({
        cityId,
        name: cityName,
        country: countryName,
        addedAt: new Date()
      });
      return true; // Now a favorite
    }
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    throw new Error("Failed to update favorite status");
  }
}

export async function getFavoriteCities(): Promise<any[]> {
  try {
    const result = await db.query.favorites.findMany({
      orderBy: (favorites, { desc }) => [desc(favorites.addedAt)]
    });
    
    return result;
  } catch (error) {
    console.error("Error fetching favorite cities:", error);
    throw new Error("Failed to fetch favorite cities");
  }
}

// WEATHER CONTROLLER FUNCTIONS

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
