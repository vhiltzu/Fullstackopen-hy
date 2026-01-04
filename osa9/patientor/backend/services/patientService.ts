import { v1 as uuid } from 'uuid';
import patientData from '../data/patients';
import { NewPatient, Patient } from '../types';

const getPatients = (): Patient[] => {
  return patientData;
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient,
  };

  patientData.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  addPatient
};