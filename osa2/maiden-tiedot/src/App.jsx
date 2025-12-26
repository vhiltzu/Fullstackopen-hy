import { useEffect, useState } from "react";
import service from "./service";

const Filter = (props) => (
  <div>
    find countries <input value={props.filter} onChange={props.onChange} />
  </div>
);

const CountryList = (props) => {
  // Exactly one country
  if (props.countries.length === 1) {
    return null;
  }

  // Up to 10 countries
  if (props.countries.length <= 10) {
    return (
      <div>
        {props.countries.map((country) => (
          <CountryListItem
            key={country.name.common}
            name={country.name.common}
            onSelect={() => props.onSelect(country)}
          />
        ))}
      </div>
    );
  }

  // More than 10 countries
  return <div>Too many matches, specify another filter</div>;
};

const CountryListItem = (props) => {
  return (
    <div>
      {props.name} <button onClick={props.onSelect}>show</button>
    </div>
  );
};

const CountryDetails = (props) => {
  if (!props.country) {
    return null;
  }

  const languages = Object.values(props.country.languages);

  return (
    <div>
      <h2>{props.country.name.common}</h2>
      <div>Capital {props.country.capital.join(", ")}</div>
      <div>Area {props.country.area}</div>
      <h3>Languages</h3>
      <CountryLanguages languages={languages} />
      <CountryFlag country={props.country} />
      <CapitalWeather
        capital={props.country.capital[0]}
        weather={props.weather}
      />
    </div>
  );
};

const CountryLanguages = (props) => {
  return (
    <ul>
      {props.languages.map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
  );
};

const CountryFlag = (props) => {
  return (
    <div>
      <img
        src={props.country.flags.svg}
        alt={props.country.flags.alt}
        width="200"
      />
    </div>
  );
};

const CapitalWeather = (props) => {
  if (!props.weather) {
    return null;
  }

  return (
    <div>
      <h3>Weather in {props.capital}</h3>
      <div>Temperature {props.weather.main.temp} Celsius</div>
      <div>
        <img
          src={`http://openweathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`}
          alt={props.weather.weather[0].description}
        />
      </div>
      <div>Wind {props.weather.wind.speed} m/s</div>
    </div>
  );
};

const App = () => {
  // State for the filter input field
  const [filter, setFilter] = useState("");

  // State for the countries
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryWeather, setSelectedCountryWeather] = useState(null);

  // Initialize list of persons from server at first render
  useEffect(() => {
    // Fetch data from server
    service.getAll().then((response) => {
      setCountries(response);
    });
  }, []);

  // Handle filter input field changes
  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);

    const matchedCountries = findCountriesByName(newFilter);

    // If exactly one country matches, select it
    if (matchedCountries.length === 1) {
      setSelectedCountry(matchedCountries[0]);
      fetchWeatherForCountry(matchedCountries[0]);
      return;
    }

    setSelectedCountry(null);
    setSelectedCountryWeather(null);
  };

  // Handle country selection from the list
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  // Find countries by name
  const findCountriesByName = (name) => {
    if (!filter) {
      return [];
    }

    return countries.filter((country) =>
      country.name.common.toLowerCase().includes(name.toLowerCase())
    );
  };

  // Get current weather for selected country
  const fetchWeatherForCountry = (country) => {
    if (!country || !country.capital || country.capital.length === 0) {
      return null;
    }

    const capital = country.capital[0];

    service.getWeatherForCity(capital).then((weather) => {
      setSelectedCountryWeather(weather);
    });
  };

  const filteredCountries = findCountriesByName(filter);

  return (
    <div>
      <Filter filter={filter} onChange={handleFilterChange} />
      <CountryList
        selectedCountry={selectedCountry}
        countries={filteredCountries}
        onSelect={handleCountrySelect}
      />
      {selectedCountry && (
        <CountryDetails
          country={selectedCountry}
          weather={selectedCountryWeather}
        />
      )}
    </div>
  );
};

export default App;
