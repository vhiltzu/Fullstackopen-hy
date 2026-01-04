import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { isNotNumber } from './utils';

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});