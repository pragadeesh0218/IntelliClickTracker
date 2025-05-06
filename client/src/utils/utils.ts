import { useState, useEffect } from "react";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Original utils.ts functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatters.ts functions
export const formatPopulation = (population: number): string => {
  if (!population) return "Unknown";
  
  if (population >= 1000000) {
    return `${(population / 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 })} million`;
  } else if (population >= 1000) {
    return population.toLocaleString();
  }
  
  return population.toString();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Get day name (e.g., "Mon")
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  
  // Get month and day (e.g., "Jun 5")
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return `${dayName}, ${monthDay}`;
};

export const formatWindSpeed = (speed: number, unit: 'kmh' | 'mph' | 'ms'): string => {
  if (unit === 'mph') {
    // Convert from m/s to mph
    return `${Math.round(speed * 2.237)} mph`;
  } else if (unit === 'kmh') {
    // Convert from m/s to km/h
    return `${Math.round(speed * 3.6)} km/h`;
  }
  
  // Default is m/s
  return `${Math.round(speed)} m/s`;
};

export const getWeatherBackgroundClass = (weatherMain: string): string => {
  const main = weatherMain.toLowerCase();
  
  if (main.includes('clear') || main.includes('sun')) {
    return 'weather-bg-clear';
  } else if (main.includes('cloud')) {
    return 'weather-bg-cloudy';
  } else if (main.includes('rain') || main.includes('drizzle')) {
    return 'weather-bg-rainy';
  } else if (main.includes('thunder') || main.includes('storm')) {
    return 'weather-bg-stormy';
  } else if (main.includes('snow')) {
    return 'weather-bg-snowy';
  } else if (main.includes('mist') || main.includes('fog') || main.includes('haze')) {
    return 'weather-bg-foggy';
  }
  
  return 'weather-bg-clear'; // Default
};

// useWeatherBackground.ts hook
export function useWeatherBackground(weatherCondition: string): string {
  const [backgroundClass, setBackgroundClass] = useState("weather-bg-clear");

  useEffect(() => {
    if (weatherCondition) {
      setBackgroundClass(getWeatherBackgroundClass(weatherCondition));
    }
  }, [weatherCondition]);

  return backgroundClass;
}

// useDebounce.ts hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// useMobile.tsx hook
const MOBILE_BREAKPOINT = 768;

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
