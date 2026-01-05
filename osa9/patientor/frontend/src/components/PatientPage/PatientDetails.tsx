import { Box } from "@mui/material";
import { Patient } from "../../types";

interface Props {
  patient: Patient;
}

const PatientDetails = ({ patient }: Props) => {
  return (
    <Box>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
    </Box>
  );
};

export default PatientDetails;
