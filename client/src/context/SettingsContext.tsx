import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Settings } from "@/types";

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  isSettingsModalOpen: boolean;
  toggleSettingsModal: () => void;
}

const defaultSettings: Settings = {
  tempUnit: "celsius",
  windUnit: "kmh",
  theme: "light",
};

// Create context with a meaningful default to avoid undefined checks
const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  isSettingsModalOpen: false,
  toggleSettingsModal: () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      // Load settings from localStorage if available
      const savedSettings = localStorage.getItem("weatherSettings");
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error("Failed to parse settings from localStorage:", error);
      return defaultSettings;
    }
  });
  
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    try {
      // Save settings to localStorage whenever they change
      localStorage.setItem("weatherSettings", JSON.stringify(settings));
      
      // Apply theme
      const root = document.documentElement;
      if (settings.theme === "dark") {
        root.classList.add("dark");
      } else if (settings.theme === "light") {
        root.classList.remove("dark");
      } else {
        // For 'system' theme, check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        prefersDark ? root.classList.add("dark") : root.classList.remove("dark");
      }
    } catch (error) {
      console.error("Error applying settings:", error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  const value = {
    settings,
    updateSettings,
    isSettingsModalOpen,
    toggleSettingsModal,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  return context;
};
