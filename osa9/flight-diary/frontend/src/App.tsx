import { useEffect, useState } from "react";

import diarySeryice from "./services/diaries";
import type { DiaryEntry } from "./types";
import DiaryEntryList from "./components/DiaryEntryList";
import NewDiaryEntryForm from "./components/NewDiaryEntryForm";
import axios from "axios";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDiaries = async () => {
      const fetchedDiaries = await diarySeryice.getAll();
      setDiaries(fetchedDiaries);
    };
    fetchDiaries();
  }, []);

  const handleNewDiaryEntry = async (diaryEntry: Omit<DiaryEntry, "id">) => {
    try {
      setError("");
      const newDiaryEntry = await diarySeryice.create(diaryEntry);
      setDiaries(diaries.concat(newDiaryEntry));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        // Handle Axios error
        setError(e.response?.data);
      } else {
        // Unknown error type
        setError(String(e));
      }
    }
  };

  return (
    <div>
      <NewDiaryEntryForm onSubmit={handleNewDiaryEntry} error={error} />
      <DiaryEntryList entries={diaries} />
    </div>
  );
}

export default App;
