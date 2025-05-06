import React from "react";

interface WeatherIconProps {
  weather: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ weather, className = "" }) => {
  // Map weather condition to the appropriate icon
  const getIcon = () => {
    const normalizedWeather = weather.toLowerCase();
    
    if (normalizedWeather.includes("clear") || normalizedWeather === "sunny") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2" />
          <path d="M12 21v2" />
          <path d="M4.22 4.22l1.42 1.42" />
          <path d="M18.36 18.36l1.42 1.42" />
          <path d="M1 12h2" />
          <path d="M21 12h2" />
          <path d="M4.22 19.78l1.42-1.42" />
          <path d="M18.36 5.64l1.42-1.42" />
        </svg>
      );
    } else if (normalizedWeather.includes("cloud") || normalizedWeather === "overcast") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
    } else if (normalizedWeather.includes("rain") || normalizedWeather.includes("drizzle")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9" />
          <path d="M16 14v6" />
          <path d="M8 14v6" />
          <path d="M12 16v6" />
        </svg>
      );
    } else if (normalizedWeather.includes("thunder") || normalizedWeather.includes("storm")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
          <path d="m13 12-3 5h4l-3 5" />
        </svg>
      );
    } else if (normalizedWeather.includes("snow")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
          <path d="M8 16h.01" />
          <path d="M8 20h.01" />
          <path d="M12 18h.01" />
          <path d="M12 22h.01" />
          <path d="M16 16h.01" />
          <path d="M16 20h.01" />
        </svg>
      );
    } else if (normalizedWeather.includes("mist") || normalizedWeather.includes("fog") || normalizedWeather.includes("haze")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 5h3m4 0h9" />
          <path d="M3 10h11m4 0h1" />
          <path d="M5 15h5m4 0h7" />
          <path d="M3 20h9m4 0h3" />
        </svg>
      );
    } else if (normalizedWeather.includes("hot")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 12c0-3.314-1-6-1-6s-1 2.686-1 6 1 6 1 6 1-2.686 1-6Z" />
          <path d="M9 16c-2.21 0-4-1.678-4-3.75S6.79 8.5 9 8.5c1.437 0 2.307.426 3 1.5 1.326-2.036 4-2.5 4-2.5v4c0 2.072-1.79 3.75-4 3.75s-3-1.325-3-1.325" />
        </svg>
      );
    } else if (normalizedWeather.includes("cold")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 12h10" />
          <path d="M9 4v16" />
          <path d="m3 9 3 3-3 3" />
          <path d="M12 20v-8a4 4 0 0 1 4-4h1a3 3 0 0 1 0 6h-5" />
        </svg>
      );
    } else {
      // Default icon for any other weather condition
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v.01" />
          <path d="M12 8v4" />
        </svg>
      );
    }
  };

  return getIcon();
};

export default WeatherIcon;
