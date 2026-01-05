import { Alert, Box } from "@mui/material";
import { useMatch } from "react-router-dom";

import { Diagnosis, Patient } from "../../types";
import PatientDetails from "./PatientDetails";
import PatientGenderIcon from "./PatientGenderIcon";
import HealthEntryList from "./HealthEntryList";

interface Props {
  patients: Patient[];
  diagnoses: Diagnosis[];
}

const PatientPage = ({ patients, diagnoses }: Props) => {
  const patientRouteMatch = useMatch("/:patientId");

  // Find the patient based on the route parameter
  const patient = patients.find(
    (p) => p.id === patientRouteMatch?.params.patientId
  );

  if (!patient) {
    return <Alert severity="error">Patient not found</Alert>;
  }

  return (
    <div className="App">
      <Box>
        <h2>
          {patient.name} <PatientGenderIcon gender={patient.gender} />
        </h2>
      </Box>
      <PatientDetails patient={patient} />
      <HealthEntryList entries={patient.entries} diagnoses={diagnoses} />
    </div>
  );
};

export default PatientPage;
