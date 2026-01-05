import { useState } from "react";
import { Visibility, Weather, type NewDiaryEntry } from "../types";
import ErrorNotification from "./ErrorNotification";

interface NewDiaryEntryFormProps {
  onSubmit: (data: NewDiaryEntry) => void;
  error?: string;
}

const NewDiaryEntryForm = ({ onSubmit, error }: NewDiaryEntryFormProps) => {
  const [date, setDate] = useState<string>("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [visibility, setVisibility] = useState<Visibility | null>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Do not submit if weather or visibility is not selected
    if (weather === null || visibility === null) {
      return;
    }

    onSubmit({
      date,
      weather,
      visibility,
      comment,
    });
    setDate("");
    setWeather(null);
    setVisibility(null);
    setComment("");
  };

  return (
    <div>
      <h2>Add new diary entry</h2>
      <ErrorNotification message={error} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date: </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <span>Weather: </span>
          {Object.entries(Weather).map(([key, value]) => (
            <div key={key} style={{ display: "inline" }}>
              <label htmlFor={`weather-${value}`}>{value}</label>
              <input
                type="radio"
                name="weather"
                value={value}
                checked={weather === value}
                onChange={() => setWeather(value)}
                required
              />
            </div>
          ))}
        </div>
        <div>
          <span>Visibility: </span>
          {Object.entries(Visibility).map(([key, value]) => (
            <div key={key} style={{ display: "inline" }}>
              <label htmlFor={`visibility-${value}`}>{value}</label>
              <input
                type="radio"
                name="visibility"
                id={`visibility-${value}`}
                value={value}
                checked={visibility === value}
                onChange={() => setVisibility(value)}
                required
              />
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="comment">Comment: </label>
          <input
            type="text"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewDiaryEntryForm;
