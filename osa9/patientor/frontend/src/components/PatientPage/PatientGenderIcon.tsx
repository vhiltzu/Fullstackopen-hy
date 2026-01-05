import {
  Male as MaleIcon,
  Female as FemaleIcon,
  AllInclusive as OtherIcon,
} from "@mui/icons-material";

import { Patient } from "../../types";

interface Props {
  gender: Patient["gender"];
}

const PatientGenderIcon = ({ gender }: Props) => {
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

export default PatientGenderIcon;
