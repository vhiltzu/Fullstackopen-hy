import { useEffect, useState } from "react";

import diarySeryice from "./services/diaries";
import type { DiaryEntry } from "./types";
import DiaryEntryList from "./components/DiaryEntryList";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const fetchedDiaries = await diarySeryice.getAll();
      setDiaries(fetchedDiaries);
    };
    void fetchDiaries();
  }, []);

  return (
    <div>
      <DiaryEntryList entries={diaries} />
    </div>
  );
}

export default App;
