import {
  MedicalServices as HealthCheckIcon,
  Work as OccupationalEntryIcon,
  LocalHospital as HospitalEntryIcon,
  Favorite as HealthRatingIcon,
} from "@mui/icons-material";

import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../../types";
import { Button } from "@mui/material";

interface Props {
  entries: Entry[];
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HealthEntryList = ({ entries, diagnoses }: Props) => {
  return (
    <div>
      <h3>entries</h3>
      {entries.map((entry) => (
        <div
          key={entry.id}
          style={{
            border: "1px solid black",
            margin: "8px 0",
            borderRadius: 4,
            padding: 16,
          }}
        >
          <EntryDetails entry={entry} diagnoses={diagnoses} />
        </div>
      ))}
      <Button variant="contained" color="primary">
        Add New Entry
      </Button>
    </div>
  );
};

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return (
        <OccupationalHealthcareEntryDetails
          entry={entry}
          diagnoses={diagnoses}
        />
      );
    case "HealthCheck":
      return <HealthCheckDetails entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

const HospitalEntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <div>
      <div>
        {entry.date} <HospitalEntryIcon />
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <DiagnosisList
        diagnosisCodes={entry.diagnosisCodes || []}
        diagnoses={diagnoses}
      />
      <div>diagnose by: {entry.specialist}</div>
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <div>
      <div>
        {entry.date} <OccupationalEntryIcon /> <i>{entry.employerName}</i>
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <DiagnosisList
        diagnosisCodes={entry.diagnosisCodes || []}
        diagnoses={diagnoses}
      />
      <div>diagnose by: {entry.specialist}</div>
    </div>
  );
};

const HealthCheckDetails = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <div>
      <div>
        {entry.date} <HealthCheckIcon />
      </div>
      <div>
        <i>{entry.description}</i>
      </div>
      <DiagnosisList
        diagnosisCodes={entry.diagnosisCodes || []}
        diagnoses={diagnoses}
      />
      <div>
        <HealthCheckRatingIcon rating={entry.healthCheckRating} />
      </div>
      <div>diagnose by: {entry.specialist}</div>
    </div>
  );
};

const HealthCheckRatingIcon = ({ rating }: { rating: HealthCheckRating }) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return <HealthRatingIcon htmlColor="green" />;
    case HealthCheckRating.LowRisk:
      return <HealthRatingIcon htmlColor="yellow" />;
    case HealthCheckRating.HighRisk:
      return <HealthRatingIcon htmlColor="orange" />;
    case HealthCheckRating.CriticalRisk:
      return <HealthRatingIcon htmlColor="red" />;
    default:
      return assertNever(rating);
  }
};

const DiagnosisList = ({
  diagnosisCodes,
  diagnoses,
}: {
  diagnosisCodes: string[];
  diagnoses: Diagnosis[];
}) => {
  return (
    <ul>
      {diagnosisCodes.map((code) => (
        <li key={code}>
          {code} {diagnoses.find((d) => d.code === code)?.name}
        </li>
      ))}
    </ul>
  );
};

export default HealthEntryList;
