import { Gender, NewPatient } from "./types";

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "occupation" in object &&
    "gender" in object &&
    "ssn" in object &&
    "dateOfBirth" in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      occupation: parseOccupation(object.occupation),
      gender: parseGender(object.gender),
      ssn: object.ssn ? parseSsn(object.ssn) : undefined,
      dateOfBirth: object.dateOfBirth
        ? parseDate(object.dateOfBirth)
        : undefined,
    };

    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
};

export { toNewPatient };

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (str: unknown, fieldName: string): string => {
  if (!str || !isString(str)) {
    throw new Error(`Incorrect or missing ${fieldName}: ${String(str)}`);
  }

  return str;
};

const parseName = (name: unknown): string => {
  return parseString(name, "name");
};

const parseOccupation = (occupation: unknown): string => {
  return parseString(occupation, "occupation");
};

const parseSsn = (ssn: unknown): string => {
  return parseString(ssn, "ssn");
};

const isGender = (str: string): str is Gender => {
  // Could be also Object.values(Gender) instea
  return ["male", "female", "other"].includes(str as Gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender: ${String(gender)}`);
  }

  return gender;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date: ${String(date)}`);
  }
  return date;
};
