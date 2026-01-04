import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';
import { isNotNumber } from './utils';

interface ExerciseRequestPayload {
    daily_exercises: number[];
    target: number;
}

const app = express();

app.get('/bmi', (req, res) => {
    const { height, weight } = req.query;

    if (!height || !weight || isNotNumber(height) || isNotNumber(weight)) {
        return res.status(400).send({ error: 'malformatted parameters' });
    }

    // Convert to numbers
    const heightNum = Number(height);
    const weightNum = Number(weight);

    if (heightNum <= 0 || weightNum <= 0) {
        return res.status(400).send({ error: 'height and weight must be positive numbers' });
    }

    const bmi = calculateBmi(heightNum, weightNum);

    return res.send({
        height: heightNum,
        weight: weightNum,
        bmi
    });
});

app.post('/exercises', express.json(), (req, res) => {
    const { daily_exercises, target } = req.body as ExerciseRequestPayload;

    if (!daily_exercises || !target) {
        return res.status(400).send({ error: 'parameters missing' });
    }

    // Validate that daily_exercises is an array of numbers and target is a number
    if (!Array.isArray(daily_exercises) || isNotNumber(target) || daily_exercises.some(isNotNumber)) {
        return res.status(400).send({ error: 'malformatted parameters' });
    }

    const exerciseResult = exerciseCalculator(daily_exercises.map(Number), Number(target));

    return res.send(exerciseResult);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});