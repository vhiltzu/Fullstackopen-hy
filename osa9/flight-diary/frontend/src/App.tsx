import { useEffect, useState } from "react";

import diarySeryice from "./services/diaries";
import type { DiaryEntry } from "./types";
import DiaryEntryList from "./components/DiaryEntryList";
import NewDiaryEntryForm from "./components/NewDiaryEntryForm";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const fetchedDiaries = await diarySeryice.getAll();
      setDiaries(fetchedDiaries);
    };
    fetchDiaries();
  }, []);

  const handleNewDiaryEntry = async (diaryEntry: Omit<DiaryEntry, "id">) => {
    const newDiaryEntry = await diarySeryice.create(diaryEntry);
    setDiaries(diaries.concat(newDiaryEntry));
  };

  return (
    <div>
      <NewDiaryEntryForm onSubmit={handleNewDiaryEntry} />
      <DiaryEntryList entries={diaries} />
    </div>
  );
}

export default App;
