import { useEffect, useState } from "react";
import service from "./service";

const Filter = (props) => (
  <div>
    find countries <input value={props.filter} onChange={props.onChange} />
  </div>
);

const CountryList = (props) => {
  // Exactly one country
  if (props.selectedCountry) {
    return <CountryDetails country={props.selectedCountry} />;
  }

  if (props.countries.length === 1) {
    return <CountryDetails country={props.countries[0]} />;
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
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={props.country.flags.svg}
        alt={props.country.flags.alt}
        width="200"
      />
    </div>
  );
};

const App = () => {
  // State for the filter input field
  const [filter, setFilter] = useState("");

  // State for the countries
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
    setSelectedCountry(null);
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

  return (
    <div>
      <Filter filter={filter} onChange={handleFilterChange} />
      <CountryList
        selectedCountry={selectedCountry}
        countries={findCountriesByName(filter)}
        onSelect={handleCountrySelect}
      />
    </div>
  );
};

export default App;
