import { useState } from "react";
import type { NewDiaryEntry, Visibility, Weather } from "../types";
import ErrorNotification from "./ErrorNotification";

interface NewDiaryEntryFormProps {
  onSubmit: (data: NewDiaryEntry) => void;
  error?: string;
}

const NewDiaryEntryForm = ({ onSubmit, error }: NewDiaryEntryFormProps) => {
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      date,
      weather: weather as Weather, // No validation for now
      visibility: visibility as Visibility,
      comment,
    });
    setDate("");
    setWeather("");
    setVisibility("");
    setComment("");
  };

  return (
    <div>
      <h2>Add new diary entry</h2>
      <ErrorNotification message={error} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="text"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="weather">Weather</label>
          <input
            type="text"
            id="weather"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="visibility">Visibility</label>
          <input
            type="text"
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="comment">Comment</label>
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
