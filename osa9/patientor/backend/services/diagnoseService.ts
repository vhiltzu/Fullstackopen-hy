import diagnoseData from '../../data/diagnoses.json';

import { Diagnosis } from '../types';

const getDiagnoses = () => {
  return diagnoseData as Diagnosis[];
};

export default {
  getDiagnoses,
};