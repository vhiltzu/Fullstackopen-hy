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
    return <CountryDetails country={props.countries[0]} />;
  }

  // Up to 10 countries
  if (props.countries.length <= 10) {
    return (
      <div>
        {props.countries.map((country) => (
          <div key={country.name.common}>{country.name.common}</div>
        ))}
      </div>
    );
  }

  // More than 10 countries
  return <div>Too many matches, specify another filter</div>;
};

const CountryDetails = (props) => {
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

  // State for the list of countries
  const [countries, setCountries] = useState([]);

  // Initialize list of persons from server at first render
  useEffect(() => {
    // Fetch data from server
    service.getAll().then((countries) => {
      setCountries(countries);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const countriesToShow = countries.filter(
    (country) =>
      !!filter &&
      country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <Filter filter={filter} onChange={handleFilterChange} />
      <CountryList countries={countriesToShow} />
    </div>
  );
};

export default App;
