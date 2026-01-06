import { v1 as uuid } from "uuid";
import patientData from "../../data/patients";
import { Entry, EntryWithoutId, NewPatient, Patient } from "../types";

const getPatients = (): Patient[] => {
  return patientData;
};

const getPatientById = (id: string): Patient | undefined => {
  return patientData.find((patient) => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient,
    entries: [],
  };

  patientData.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const patient = getPatientById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatientById,
  addPatient,
  addEntry,
};
