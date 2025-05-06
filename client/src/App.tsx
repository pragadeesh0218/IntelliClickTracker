import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CitiesPage from "@/pages/cities";
import WeatherPage from "@/pages/weather";
import SettingsModal from "@/components/SettingsModal";
import { SettingsProvider } from "@/context/SettingsContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CitiesPage} />
      <Route path="/weather/:cityId" component={WeatherPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <SettingsModal />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
