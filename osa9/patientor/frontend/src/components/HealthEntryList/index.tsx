import { useState } from "react";
import { Button } from "@mui/material";
import HealthEntry from "./HealthEntry";
import patientService from "../../services/patients";
import { Diagnosis, Entry, EntryFormValues } from "../../types";
import AddEntryModal from "../AddEntryModal";
import axios from "axios";

interface Props {
  patientId: string;
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  diagnoses: Diagnosis[];
}

const HealthEntryList = ({
  patientId,
  entries,
  setEntries,
  diagnoses,
}: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const entry = await patientService.createEntry(patientId, values);
      setEntries(entries.concat(entry));
      setModalOpen(false);

      // Clear error on success
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.debug(e?.response?.data);

        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        } else if (e?.response?.data?.error) {
          const errors = Array.isArray(e.response.data.error)
            ? e.response.data.error
            : [e.response.data.error];

          // Aggregate validation error messages
          const message = errors
            .map((err: unknown) => {
              if (err && typeof err === "object" && "message" in err) {
                return err.message;
              }

              return undefined;
            })
            .filter(Boolean)
            .join(", ");
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <h3>entries</h3>
      {entries.map((entry) => (
        <HealthEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        diagnoses={diagnoses}
      />
      <Button variant="contained" color="primary" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default HealthEntryList;
