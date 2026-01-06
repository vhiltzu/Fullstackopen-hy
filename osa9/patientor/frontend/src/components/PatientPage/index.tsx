import { Alert, Box } from "@mui/material";
import {
  Male as MaleIcon,
  Female as FemaleIcon,
  AllInclusive as OtherIcon,
} from "@mui/icons-material";
import { useMatch } from "react-router-dom";

import { Diagnosis, Patient } from "../../types";
import HealthEntryList from "../HealthEntryList";

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  diagnoses: Diagnosis[];
}

const PatientPage = ({ patients, setPatients, diagnoses }: Props) => {
  const patientRouteMatch = useMatch("/:patientId");

  // Find the patient based on the route parameter
  const patient = patients.find(
    (p) => p.id === patientRouteMatch?.params.patientId
  );

  if (!patient) {
    return <Alert severity="error">Patient not found</Alert>;
  }

  const handlePatientUpdate = (updatedPatient: Patient) => {
    // Update the patients state with the updated patient details
    setPatients((prevPatients) =>
      prevPatients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
  };

  return (
    <div className="App">
      <Box>
        <h2>
          {patient.name} <PatientGenderIcon gender={patient.gender} />
        </h2>
      </Box>
      <PatientDetails patient={patient} />
      <HealthEntryList
        entries={patient.entries}
        diagnoses={diagnoses}
        patientId={patient.id}
        setEntries={(entries) => handlePatientUpdate({ ...patient, entries })}
      />
    </div>
  );
};

export default PatientPage;

interface PatientDetailsProps {
  patient: Patient;
}

const PatientDetails = ({ patient }: PatientDetailsProps) => {
  return (
    <Box>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
    </Box>
  );
};

interface PatientGenderIconProps {
  gender: Patient["gender"];
}

const PatientGenderIcon = ({ gender }: PatientGenderIconProps) => {
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
