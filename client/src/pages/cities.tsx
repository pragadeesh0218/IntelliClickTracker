import CitiesTable from "@/components/CitiesTable";
import { Helmet } from "react-helmet";

const CitiesPage = () => {
  return (
    <>
      <Helmet>
        <title>WeatherSphere - Global Weather Forecast</title>
        <meta name="description" content="Browse cities worldwide and check their current weather conditions. Access detailed weather forecasts for any location." />
      </Helmet>
      <CitiesTable />
    </>
  );
};

export default CitiesPage;
