import { useState, SyntheticEvent } from "react";

import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Chip,
} from "@mui/material";

import {
  Diagnosis,
  Entry,
  EntryFormValues,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [type, setType] = useState<Entry["type"]>("HealthCheck");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Diagnosis[]>([]);
  const [discharge, setDischarge] = useState<HospitalEntry["discharge"]>({
    date: "",
    criteria: "",
  });
  const [employerName, setEmployerName] = useState<string>("");
  const [sickLeave, setSickLeave] =
    useState<OccupationalHealthcareEntry["sickLeave"]>();
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const diagnosisCodes = selectedDiagnoses.map((d) => d.code);

    switch (type) {
      case "Hospital":
        onSubmit({
          type,
          date,
          description,
          specialist,
          diagnosisCodes,
          discharge,
        });
        return;
      case "OccupationalHealthcare":
        onSubmit({
          type,
          date,
          description,
          specialist,
          diagnosisCodes,
          employerName,
          sickLeave,
        });
        return;
      case "HealthCheck":
        onSubmit({
          type,
          date,
          description,
          specialist,
          diagnosisCodes,
          healthCheckRating,
        });
        return;
    }
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <FormLabel id="entry-type">Entry type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="entry-type"
          name="type"
          value={type}
          onChange={({ target }) => setType(target.value as Entry["type"])}
        >
          <FormControlLabel
            value="Hospital"
            control={<Radio />}
            label="Hospital"
          />
          <FormControlLabel
            value="OccupationalHealthcare"
            control={<Radio />}
            label="Occupational Healthcare"
          />
          <FormControlLabel
            value="HealthCheck"
            control={<Radio />}
            label="Health Check"
          />
        </RadioGroup>
        {type === "Hospital" && (
          <HospitalEntryFields
            discharge={discharge}
            setDischarge={setDischarge}
          />
        )}
        {type === "OccupationalHealthcare" && (
          <OccupationalHealthcareEntryFields
            employerName={employerName}
            setEmployerName={setEmployerName}
            sickLeave={sickLeave}
            setSickLeave={setSickLeave}
          />
        )}
        {type === "HealthCheck" && (
          <HealthCheckEntryFields
            healthCheckRating={healthCheckRating}
            setHealthCheckRating={setHealthCheckRating}
          />
        )}
        <InputLabel style={{ marginTop: 8 }}>Diagnosis</InputLabel>
        <Autocomplete
          multiple
          options={diagnoses}
          getOptionLabel={(option) => option.code + " " + option.name}
          defaultValue={selectedDiagnoses}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} placeholder="Diagnoses" />
          )}
          limitTags={4}
          onChange={(_, value) => setSelectedDiagnoses(value)}
          // Render tags with option.code only property
          renderTags={(value: Diagnosis[], getTagProps) =>
            value.map((option: Diagnosis, index: number) => (
              <Chip {...getTagProps({ index })} label={option.code} />
            ))
          }
        />

        <InputLabel style={{ marginTop: 8 }}>Description</InputLabel>
        <TextField
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />

        <InputLabel style={{ marginTop: 8 }}>Date</InputLabel>
        <TextField
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />

        <InputLabel style={{ marginTop: 8 }}>Specialist</InputLabel>
        <TextField
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <Grid style={{ marginTop: 8 }}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;

interface HospitalEntryFieldsProps {
  discharge: HospitalEntry["discharge"];
  setDischarge: React.Dispatch<
    React.SetStateAction<HospitalEntry["discharge"]>
  >;
}

const HospitalEntryFields = ({
  discharge,
  setDischarge,
}: HospitalEntryFieldsProps) => {
  return (
    <div>
      <InputLabel style={{ marginTop: 8 }}>Discharge Date</InputLabel>
      <TextField
        type="date"
        fullWidth
        value={discharge.date}
        onChange={({ target }) =>
          setDischarge({
            date: target.value,
            criteria: discharge.criteria,
          })
        }
      />
      <InputLabel style={{ marginTop: 8 }}>Discharge Criteria</InputLabel>
      <TextField
        fullWidth
        value={discharge.criteria}
        onChange={({ target }) =>
          setDischarge({
            date: discharge.date,
            criteria: target.value,
          })
        }
      />
    </div>
  );
};

interface OccupationalHealthcareEntryFieldsProps {
  employerName: string;
  setEmployerName: React.Dispatch<React.SetStateAction<string>>;
  sickLeave: OccupationalHealthcareEntry["sickLeave"] | undefined;
  setSickLeave: React.Dispatch<
    React.SetStateAction<OccupationalHealthcareEntry["sickLeave"] | undefined>
  >;
}

const OccupationalHealthcareEntryFields = ({
  employerName,
  setEmployerName,
  sickLeave,
  setSickLeave,
}: OccupationalHealthcareEntryFieldsProps) => {
  const sickLeaveEndDateError = sickLeave
    ? new Date(sickLeave.endDate) < new Date(sickLeave.startDate)
    : false;

  const sickLeaveStartDateError = sickLeave
    ? new Date(sickLeave.endDate) < new Date(sickLeave.startDate)
    : false;

  return (
    <div>
      <InputLabel style={{ marginTop: 8 }}>Employer Name</InputLabel>
      <TextField
        fullWidth
        value={employerName}
        onChange={({ target }) => setEmployerName(target.value)}
      />
      <InputLabel style={{ marginTop: 8 }}>Sick Leave Start Date</InputLabel>
      <TextField
        type="date"
        fullWidth
        value={sickLeave ? sickLeave.startDate : ""}
        error={sickLeaveStartDateError}
        helperText={
          sickLeaveStartDateError && "Start date cannot be after end date"
        }
        onChange={({ target }) =>
          setSickLeave({
            startDate: target.value,
            endDate: sickLeave ? sickLeave.endDate : "",
          })
        }
      />
      <InputLabel style={{ marginTop: 8 }}>Sick Leave End Date</InputLabel>
      <TextField
        type="date"
        fullWidth
        value={sickLeave ? sickLeave.endDate : ""}
        error={sickLeaveEndDateError}
        helperText={
          sickLeaveEndDateError && "End date cannot be before start date"
        }
        onChange={({ target }) =>
          setSickLeave({
            startDate: sickLeave ? sickLeave.startDate : "",
            endDate: target.value,
          })
        }
      />
    </div>
  );
};

interface HealthCheckEntryFieldsProps {
  healthCheckRating: HealthCheckRating;
  setHealthCheckRating: React.Dispatch<React.SetStateAction<HealthCheckRating>>;
}

const HealthCheckEntryFields = ({
  healthCheckRating,
  setHealthCheckRating,
}: HealthCheckEntryFieldsProps) => {
  // Handle change for health check rating select
  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const rating = Object.values(HealthCheckRating).find(
        (r) => r.toString() === value
      );
      if (rating) {
        setHealthCheckRating(rating as HealthCheckRating);
      }
    }
  };

  return (
    <div>
      <InputLabel style={{ marginTop: 8 }}>Health Check Rating</InputLabel>
      <Select
        label="Health Check Rating"
        fullWidth
        value={healthCheckRating.toString()}
        onChange={onHealthCheckRatingChange}
      >
        <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
        <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
        <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
        <MenuItem value={HealthCheckRating.CriticalRisk}>
          Critical Risk
        </MenuItem>
      </Select>
    </div>
  );
};
