import { Alert, Box } from "@mui/material";
import {
  Male as MaleIcon,
  Female as FemaleIcon,
  AllInclusive as OtherIcon,
} from "@mui/icons-material";
import { useMatch } from "react-router-dom";

import { Patient } from "../../types";

interface Props {
  patients: Patient[];
}

const PatientPage = ({ patients }: Props) => {
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
      <Box>
        <div>ssn: {patient.ssn}</div>
        <div>occupation: {patient.occupation}</div>
      </Box>
    </div>
  );
};

export default PatientPage;

const PatientGenderIcon = ({ gender }: Pick<Patient, "gender">) => {
  switch (gender) {
    case "male":
      return <MaleIcon />;
    case "female":
      return <FemaleIcon />;
    case "other":
      return <OtherIcon />;
    default:
      return null;
  }
};
