import axios from "axios";
import { City, CitySearchResult } from "@/types";
import { db } from "@db";
import { favorites } from "@shared/schema";
import { eq } from "drizzle-orm";

const CITIES_API_URL = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records";

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
