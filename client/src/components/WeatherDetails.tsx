import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CurrentWeather, DailyForecast, City } from "@/types";
import WeatherIcon from "./WeatherIcon";
import { useSettings } from "@/context/SettingsContext";
import { useState } from "react";
import { useWeatherBackground } from "@/hooks/useWeatherBackground";
import { formatDate, formatWindSpeed } from "@/utils/formatters";

interface WeatherDetailsProps {
  cityId: string;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ cityId }) => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'hourly' | 'details'>('forecast');
  const { settings, toggleSettingsModal } = useSettings();
  
  const { data: city } = useQuery<City>({
    queryKey: [`/api/cities/${cityId}`],
    queryFn: undefined,
  });

  const { data: currentWeather, isLoading: loadingCurrent } = useQuery<CurrentWeather>({
    queryKey: [`/api/weather/current/${cityId}`],
    queryFn: undefined,
    enabled: !!cityId,
  });

  const { data: forecast, isLoading: loadingForecast } = useQuery<{ daily: DailyForecast[] }>({
    queryKey: [`/api/weather/forecast/${cityId}`],
    queryFn: undefined,
    enabled: !!cityId,
  });

  const backgroundClass = useWeatherBackground(
    currentWeather?.weather[0]?.main || "Clear"
  );

  const formatTemp = (temp: number) => {
    if (settings.tempUnit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };

  if (loadingCurrent || loadingForecast || !currentWeather || !city) {
    return (
      <div className="weather-bg-clear text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-xl">Loading weather data...</p>
        </div>
      </div>
    );
  }

  const weather = currentWeather.weather[0];

  return (
    <div className={`${backgroundClass} text-white animate-fadeIn`}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center">
              <Link href="/">
                <button className="mr-3 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold">{city.name}</h1>
            </div>
            <p className="text-lg opacity-90 mt-1">{city.cou_name_en}, {city.timezone}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="flex items-center bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>Add to Favorites</span>
            </button>
            <button className="flex items-center bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg" onClick={toggleSettingsModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>
        
        {/* Current Weather */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="text-center md:text-left md:mr-10">
              <div className="flex items-center justify-center md:justify-start">
                <WeatherIcon weather={weather.main} className="text-6xl" />
              </div>
              <div className="mt-2">
                <h2 className="text-5xl font-bold">{formatTemp(currentWeather.main.temp)}</h2>
                <p className="text-xl opacity-90">{weather.description}</p>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <p className="text-sm opacity-80">Feels Like</p>
                <p className="text-xl font-semibold">{formatTemp(currentWeather.main.feels_like)}</p>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <p className="text-sm opacity-80">Humidity</p>
                <p className="text-xl font-semibold">{currentWeather.main.humidity}%</p>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <p className="text-sm opacity-80">Wind</p>
                <p className="text-xl font-semibold">{formatWindSpeed(currentWeather.wind.speed, settings.windUnit)}</p>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-lg">
                <p className="text-sm opacity-80">Pressure</p>
                <p className="text-xl font-semibold">{currentWeather.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Weather toggles */}
        <div className="flex mb-6 border-b border-white/20">
          <button 
            className={`px-6 py-3 font-medium text-white ${activeTab === 'forecast' ? 'opacity-90 border-b-2 border-white' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setActiveTab('forecast')}
          >
            5-Day Forecast
          </button>
          <button 
            className={`px-6 py-3 font-medium text-white ${activeTab === 'hourly' ? 'opacity-90 border-b-2 border-white' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setActiveTab('hourly')}
          >
            Hourly
          </button>
          <button 
            className={`px-6 py-3 font-medium text-white ${activeTab === 'details' ? 'opacity-90 border-b-2 border-white' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>
        
        {/* 5-Day Forecast */}
        {activeTab === 'forecast' && forecast && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {forecast.daily.map((day, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                <p className="text-center font-medium mb-2">{formatDate(day.date)}</p>
                <div className="flex justify-center">
                  <WeatherIcon weather={day.weather.main} className="text-4xl" />
                </div>
                <div className="flex justify-between mt-3">
                  <p>Max: <span className="font-semibold">{formatTemp(day.temp_max)}</span></p>
                  <p>Min: <span className="font-semibold">{formatTemp(day.temp_min)}</span></p>
                </div>
                <p className="mt-2 text-sm opacity-90 text-center">{day.weather.description}</p>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span>Precipitation</span>
                    <span>{Math.round(day.pop * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Humidity</span>
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Wind</span>
                    <span>{formatWindSpeed(day.wind, settings.windUnit)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Hourly section */}
        {activeTab === 'hourly' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white mb-8">
            <h3 className="text-xl font-semibold mb-4">Hourly Forecast</h3>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {Array(24).fill(0).map((_, i) => {
                  // Mock hourly data - in real implementation this would come from the API
                  const hour = new Date();
                  hour.setHours(hour.getHours() + i);
                  const temp = Math.round(currentWeather.main.temp - 1 + Math.random() * 5);
                  return (
                    <div key={i} className="flex-shrink-0 w-24 bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium">{hour.getHours()}:00</p>
                      <WeatherIcon weather={weather.main} className="text-2xl mx-auto my-2" />
                      <p className="font-semibold">{formatTemp(temp)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-sm opacity-70 mt-4 text-center">Hourly forecast available with a premium plan</p>
          </div>
        )}
        
        {/* Details section */}
        {activeTab === 'details' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white mb-8">
            <h3 className="text-xl font-semibold mb-4">Location Map</h3>
            <div className="h-60 md:h-80 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
              <iframe
                title="City Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&q=${encodeURIComponent(city.name + ',' + city.cou_name_en)}`}
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm opacity-80">Latitude</p>
                <p className="font-medium">{city.coordinates.lat.toFixed(4)}° {city.coordinates.lat > 0 ? 'N' : 'S'}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Longitude</p>
                <p className="font-medium">{city.coordinates.lon.toFixed(4)}° {city.coordinates.lon > 0 ? 'E' : 'W'}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Elevation</p>
                <p className="font-medium">~{Math.round(Math.random() * 100 + 10)}m</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Local Time</p>
                <p className="font-medium">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
