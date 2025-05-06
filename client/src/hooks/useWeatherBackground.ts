import { useState, useEffect } from "react";
import { getWeatherBackgroundClass } from "@/utils/formatters";

export function useWeatherBackground(weatherCondition: string): string {
  const [backgroundClass, setBackgroundClass] = useState("weather-bg-clear");

  useEffect(() => {
    if (weatherCondition) {
      setBackgroundClass(getWeatherBackgroundClass(weatherCondition));
    }
  }, [weatherCondition]);

  return backgroundClass;
}
