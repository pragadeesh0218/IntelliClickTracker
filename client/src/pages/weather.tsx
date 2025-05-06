import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import WeatherDetails from "@/components/WeatherDetails";
import { Helmet } from "react-helmet";
import { queryClient } from "@/lib/queryClient";

const WeatherPage = () => {
  const [match, params] = useRoute("/weather/:cityId");
  const cityId = params?.cityId;

  const { data: city } = useQuery({
    queryKey: [`/api/cities/${cityId}`],
    queryFn: undefined,
    enabled: !!cityId,
  });

  useEffect(() => {
    // Save to history when this page is viewed
    if (city) {
      // Get existing history from localStorage
      const historyString = localStorage.getItem("weatherHistory") || "[]";
      const history = JSON.parse(historyString);
      
      // Add current city to history, avoiding duplicates
      const existingIndex = history.findIndex((item: any) => item.id === city.id);
      if (existingIndex !== -1) {
        // Remove existing entry to move it to the top
        history.splice(existingIndex, 1);
      }
      
      // Add to the beginning of the array with timestamp
      history.unshift({
        id: city.id,
        name: city.name,
        country: city.cou_name_en,
        timestamp: new Date().toISOString()
      });
      
      // Keep only the last 10 items
      const trimmedHistory = history.slice(0, 10);
      
      // Save back to localStorage
      localStorage.setItem("weatherHistory", JSON.stringify(trimmedHistory));
    }
  }, [city]);

  useEffect(() => {
    // When this component mounts, prefetch the weather data
    if (cityId) {
      queryClient.prefetchQuery({
        queryKey: [`/api/weather/current/${cityId}`],
        queryFn: undefined,
      });
      queryClient.prefetchQuery({
        queryKey: [`/api/weather/forecast/${cityId}`],
        queryFn: undefined,
      });
    }
  }, [cityId]);

  if (!match) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{city ? `${city.name} Weather - WeatherSphere` : 'Loading Weather...'}</title>
        <meta name="description" content={city ? `Current weather and forecast for ${city.name}, ${city.cou_name_en}. Get hourly and 5-day forecasts, temperature, precipitation, and more.` : 'Loading weather information...'} />
      </Helmet>
      <WeatherDetails cityId={cityId || ""} />
    </>
  );
};

export default WeatherPage;
