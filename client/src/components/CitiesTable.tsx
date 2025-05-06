import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { City, SortConfig, FilterConfig } from "@/types";
import WeatherIcon from "./WeatherIcon";
import { formatPopulation } from "@/utils/formatters";
import { useSettings } from "@/context/SettingsContext";

const CitiesTable = () => {
  const [page, setPage] = useState(1);
  const [cities, setCities] = useState<City[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({ continent: "all" });
  const observerTarget = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  const { data, isLoading, isFetching, hasNextPage } = useQuery({
    queryKey: ["/api/cities", page, sortConfig, filterConfig],
    queryFn: undefined,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setCities(data.cities);
      } else {
        setCities(prev => [...prev, ...data.cities]);
      }
    }
  }, [data, isLoading, page]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
    setPage(1);
    setCities([]);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterConfig({ continent: e.target.value });
    setPage(1);
    setCities([]);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "name_asc") {
      setSortConfig({ key: "name", direction: "asc" });
    } else if (value === "name_desc") {
      setSortConfig({ key: "name", direction: "desc" });
    } else if (value === "population_asc") {
      setSortConfig({ key: "population", direction: "asc" });
    } else if (value === "population_desc") {
      setSortConfig({ key: "population", direction: "desc" });
    } else if (value === "country_asc") {
      setSortConfig({ key: "cou_name_en", direction: "asc" });
    }
    setPage(1);
    setCities([]);
  };

  const getArrowIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <span className="material-icons ml-1 text-sm opacity-0">arrow_upward</span>;
    }
    return sortConfig.direction === 'asc'
      ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
          <path d="m18 15-6-6-6 6" />
        </svg>
      )
      : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
  };

  // Intersection observer for infinite scrolling
  const lastCityRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading || isFetching) return;
    if (observerTarget.current) observerTarget.current.disconnect();
    
    observerTarget.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observerTarget.current.observe(node);
  }, [isLoading, isFetching, hasNextPage]);

  const formatTemp = (temp?: number) => {
    if (temp === undefined) return 'N/A';
    if (settings.tempUnit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading cities...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Cities Database</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <select 
              className="pl-9 pr-4 py-2 rounded-lg border border-input focus:border-primary focus:outline-none text-sm bg-background w-full"
              value={filterConfig.continent}
              onChange={handleFilterChange}
            >
              <option value="all">All Continents</option>
              <option value="Africa">Africa</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="Oceania">Oceania</option>
              <option value="South America">South America</option>
            </select>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M3 16v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
                <path d="M7 8v7" />
                <path d="M12 4v11" />
                <path d="M17 11v4" />
              </svg>
            </span>
            <select 
              className="pl-9 pr-4 py-2 rounded-lg border border-input focus:border-primary focus:outline-none text-sm bg-background w-full"
              onChange={handleSortChange}
              defaultValue="name_asc"
            >
              <option value="name_asc">Sort by Name (A-Z)</option>
              <option value="name_desc">Sort by Name (Z-A)</option>
              <option value="population_desc">Sort by Population (High-Low)</option>
              <option value="population_asc">Sort by Population (Low-High)</option>
              <option value="country_asc">Sort by Country (A-Z)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-card rounded-lg shadow">
        <table className="w-full cities-table">
          <thead>
            <tr className="text-left border-b">
              <th 
                className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  City
                  {getArrowIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted"
                onClick={() => handleSort('cou_name_en')}
              >
                <div className="flex items-center">
                  Country
                  {getArrowIcon('cou_name_en')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted"
                onClick={() => handleSort('population')}
              >
                <div className="flex items-center">
                  Population
                  {getArrowIcon('population')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted"
                onClick={() => handleSort('timezone')}
              >
                <div className="flex items-center">
                  Timezone
                  {getArrowIcon('timezone')}
                </div>
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Weather
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cities.map((city, index) => (
              <tr 
                key={city.id} 
                className="hover:bg-muted/50"
                ref={index === cities.length - 1 ? lastCityRef : undefined}
              >
                <td className="px-6 py-4">
                  <Link href={`/weather/${city.id}`} className="font-medium text-primary hover:underline">
                    {city.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{city.cou_name_en}</td>
                <td className="px-6 py-4 text-muted-foreground">{formatPopulation(city.population)}</td>
                <td className="px-6 py-4 text-muted-foreground">{city.timezone}</td>
                <td className="px-6 py-4">
                  {city.weather ? (
                    <div className="flex items-center">
                      <WeatherIcon weather={city.weather.main} className="mr-2 text-xl" />
                      <span>
                        {formatTemp(city.weather.temp_max)} / {formatTemp(city.weather.temp_min)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No data</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(isLoading || isFetching) && (
          <div className="flex justify-center items-center py-4 border-t border-border">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading more cities...</span>
          </div>
        )}
        
        {!hasNextPage && cities.length > 0 && (
          <div className="py-4 text-center text-muted-foreground border-t border-border">
            You've reached the end of the list
          </div>
        )}
      </div>
    </div>
  );
};

export default CitiesTable;
