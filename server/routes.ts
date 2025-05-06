import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { searchCities, getCities, getCityById, toggleFavorite, getFavoriteCities, getCurrentWeather, getWeatherForecast, getWeatherSummary } from "./controllers/index";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";

  // City routes
  app.get(`${apiPrefix}/cities`, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const sortBy = (req.query.sortBy as string) || "name";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";
      const continent = (req.query.continent as string) || "all";
      
      const result = await getCities(page, limit, sortBy, sortOrder, continent);
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  app.get(`${apiPrefix}/cities/search`, async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters long" });
      }
      
      const limit = parseInt(req.query.limit as string) || 10;
      const results = await searchCities(query, limit);
      
      res.json(results);
    } catch (error) {
      console.error("Error searching cities:", error);
      res.status(500).json({ message: "Failed to search cities" });
    }
  });

  app.get(`${apiPrefix}/cities/:id`, async (req, res) => {
    try {
      const cityId = req.params.id;
      const city = await getCityById(cityId);
      
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      
      res.json(city);
    } catch (error) {
      console.error(`Error fetching city with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch city details" });
    }
  });

  // Weather routes
  app.get(`${apiPrefix}/weather/current/:cityId`, async (req, res) => {
    try {
      const cityId = req.params.cityId;
      const weatherData = await getCurrentWeather(cityId);
      
      res.json(weatherData);
    } catch (error) {
      console.error(`Error fetching current weather for city ID ${req.params.cityId}:`, error);
      res.status(500).json({ message: "Failed to fetch current weather data" });
    }
  });

  app.get(`${apiPrefix}/weather/forecast/:cityId`, async (req, res) => {
    try {
      const cityId = req.params.cityId;
      const forecastData = await getWeatherForecast(cityId);
      
      res.json(forecastData);
    } catch (error) {
      console.error(`Error fetching weather forecast for city ID ${req.params.cityId}:`, error);
      res.status(500).json({ message: "Failed to fetch weather forecast data" });
    }
  });

  app.get(`${apiPrefix}/weather/summary/:cityId`, async (req, res) => {
    try {
      const cityId = req.params.cityId;
      const summary = await getWeatherSummary(cityId);
      
      res.json(summary);
    } catch (error) {
      console.error(`Error fetching weather summary for city ID ${req.params.cityId}:`, error);
      res.status(500).json({ message: "Failed to fetch weather summary" });
    }
  });

  // Favorites routes
  app.post(`${apiPrefix}/favorites`, async (req, res) => {
    try {
      const { cityId, cityName, countryName } = req.body;
      
      if (!cityId || !cityName || !countryName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const isFavorite = await toggleFavorite(cityId, cityName, countryName);
      
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error updating favorite status:", error);
      res.status(500).json({ message: "Failed to update favorite status" });
    }
  });

  app.get(`${apiPrefix}/favorites`, async (req, res) => {
    try {
      const favorites = await getFavoriteCities();
      
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorite cities:", error);
      res.status(500).json({ message: "Failed to fetch favorite cities" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
