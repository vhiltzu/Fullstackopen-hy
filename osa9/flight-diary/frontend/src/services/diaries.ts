import axios from "axios";
import type { DiaryEntry } from "../types";
import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const response = await axios.get<DiaryEntry[]>(`${apiBaseUrl}/diaries`);
  return response.data;
};

export default { getAll };
