/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express from "express";
import patientService from "../services/patientService";

const router = express.Router();

router.get("/", (_req, res) => {
  const patients = patientService.getPatients();
  res.json(patients);
});

router.post("/", (req, res) => {
  const { name, occupation, gender, ssn, dateOfBirth } = req.body;

  const addedPatient = patientService.addPatient({
    name,
    occupation,
    gender,
    ssn,
    dateOfBirth,
  });

  res.json(addedPatient);
});

export default router;
