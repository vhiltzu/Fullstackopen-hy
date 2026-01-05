import { v1 as uuid } from "uuid";
import patientData from "../data/patients";
import { NewPatient, Patient } from "../types";

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

export default {
  getPatients,
  getPatientById,
  addPatient,
};
