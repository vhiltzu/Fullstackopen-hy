import patientData from '../data/patients';
import { Patient } from '../types';

const getPatients = (): Patient[] => {
  return patientData;
};

export default {
  getPatients,
};