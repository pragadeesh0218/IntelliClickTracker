import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import SearchBar from "./SearchBar";
import { useSettings } from "@/context/SettingsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMobile();
  const [location] = useLocation();
  const { toggleSettingsModal } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-background transition-shadow duration-200 ${isScrolled ? "shadow-md" : ""}`}>
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3xl">
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
            <h1 className="text-xl font-bold">WeatherSphere</h1>
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-muted-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>

        {!isMobile && (
          <div className="mt-4 md:mt-0 md:w-2/5">
            <SearchBar />
          </div>
        )}

        <nav className={`${isMobile && !isMenuOpen ? "hidden" : "flex"} ${isMobile ? "flex-col mt-4" : "items-center space-x-6"} md:flex`}>
          <Link href="/" className={`py-2 ${location === "/" ? "text-primary font-medium border-b-2 border-primary" : "text-muted-foreground hover:text-primary"}`}>
            Cities
          </Link>
          <Link href="/favorites" className={`py-2 ${location === "/favorites" ? "text-primary font-medium border-b-2 border-primary" : "text-muted-foreground hover:text-primary"}`}>
            Favorites
          </Link>
          <Link href="/history" className={`py-2 ${location === "/history" ? "text-primary font-medium border-b-2 border-primary" : "text-muted-foreground hover:text-primary"}`}>
            History
          </Link>
          <button 
            onClick={toggleSettingsModal}
            className="p-1 rounded-full bg-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>
        </nav>
      </div>
      
      {isMobile && (
        <div className="container mx-auto px-4 pb-3">
          <SearchBar />
        </div>
      )}
    </header>
  );
};

export default Header;
