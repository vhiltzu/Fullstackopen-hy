import axios from "axios";
import type { DiaryEntry } from "../types";
import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const response = await axios.get<DiaryEntry[]>(`${apiBaseUrl}/diaries`);
  return response.data;
};

const create = async (newDiaryEntry: Omit<DiaryEntry, "id">) => {
  const response = await axios.post<DiaryEntry>(
    `${apiBaseUrl}/diaries`,
    newDiaryEntry
  );
  return response.data;
};

export default { getAll, create };
