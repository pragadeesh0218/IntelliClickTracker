import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { City } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/cities/search", debouncedSearchValue],
    enabled: debouncedSearchValue.length > 2,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchValue.length > 2) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [debouncedSearchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCitySelect = (city: City) => {
    setLocation(`/weather/${city.id}`);
    setIsDropdownVisible(false);
    setSearchValue("");
  };

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search cities..."
        className="pl-10 pr-4 py-2 w-full rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition bg-background"
        value={searchValue}
        onChange={handleInputChange}
        onFocus={() => debouncedSearchValue.length > 2 && setIsDropdownVisible(true)}
      />
      
      {isDropdownVisible && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background shadow-lg rounded-lg border border-input max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="py-4 px-4 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Searching...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            searchResults.map((city: City) => (
              <div 
                key={city.id}
                className="py-2 px-4 hover:bg-muted cursor-pointer"
                onClick={() => handleCitySelect(city)}
              >
                <div className="font-medium">{city.name}</div>
                <div className="text-sm text-muted-foreground">{city.cou_name_en}, {city.timezone}</div>
              </div>
            ))
          ) : debouncedSearchValue.length > 2 ? (
            <div className="py-4 px-4 text-center text-muted-foreground">
              No cities found matching "{debouncedSearchValue}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
