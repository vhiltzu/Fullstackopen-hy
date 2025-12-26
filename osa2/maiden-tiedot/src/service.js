import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((response) => response.data);
};

const get = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);
  return request.then((response) => response.data);
};

const getWeatherForCity = (city) => {
  const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  return request.then((response) => response.data);
};

export default { getAll, get, getWeatherForCity };
