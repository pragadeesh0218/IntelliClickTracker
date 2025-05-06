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
