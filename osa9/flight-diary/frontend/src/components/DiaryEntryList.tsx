import type { DiaryEntry } from "../types";

interface DiaryEntryListProps {
  entries: DiaryEntry[];
}

const DiaryEntryList = ({ entries }: DiaryEntryListProps) => {
  return (
    <div>
      <h2>Diary Entries</h2>
      {entries.map((entry) => (
        <DiaryEntryListItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

interface DiaryEntryListItemProps {
  entry: DiaryEntry;
}
const DiaryEntryListItem = ({ entry }: DiaryEntryListItemProps) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <p>weather: {entry.weather}</p>
      <p>visibility: {entry.visibility}</p>
      {entry.comment && <p>comment: {entry.comment}</p>}
    </div>
  );
};

export default DiaryEntryList;
