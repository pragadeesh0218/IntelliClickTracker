// City types
export interface City {
  id: string;
  name: string;
  cou_name_en: string;
  timezone: string;
  population: number;
  coordinates: {
    lat: number;
    lon: number;
  };
  weather?: WeatherSummary;
}

export interface CitySearchResult {
  records: {
    datasetid: string;
    recordid: string;
    fields: {
      geoname_id: number;
      name: string;
      cou_name_en: string;
      timezone: string;
      population: number;
      coordinates: [number, number];
    };
    geometry: {
      type: string;
      coordinates: [number, number];
    };
  }[];
  total_count: number;
}

// Weather types
export interface WeatherSummary {
  main: string;
  description: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  icon: string;
}

export interface CurrentWeather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      "3h": number;
    };
    snow?: {
      "3h": number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface DailyForecast {
  date: string;
  dayName: string;
  temp_max: number;
  temp_min: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  pop: number;
  humidity: number;
  wind: number;
}

// Settings types
export interface Settings {
  tempUnit: 'celsius' | 'fahrenheit';
  windUnit: 'kmh' | 'mph' | 'ms';
  theme: 'light' | 'dark' | 'system';
}

// Sort and filter types
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  continent: string;
}

// Favorite city
export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
}
