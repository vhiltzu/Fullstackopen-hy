interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

function sumArray(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0);
}

// Will be used as rating descriptions
const ratingDescriptions = [
    'Work harder next time',
    'Not too bad but could be better',
    'Great job!'
];

function rateExerciseWeek(average: number, target: number): number {
    if (average >= target) {
        return 3;
    }
    
    if (average >= target / 2) {
        return 2;
    }
    
    return 1;
}

function exerciseCalculator(dailyExerciseHours: number[], target: number): ExerciseResult {
    const periodLength = dailyExerciseHours.length;

    // Its a training day if exercise hours are greater than 0
    const trainingDays = dailyExerciseHours.filter(day => day > 0).length;

    // Success a day if average exercise hours meet or exceed target amount
    const successfulDays = dailyExerciseHours.filter(day => day >= target).length;

    // Week was successful if all days were at successful
    const success = successfulDays === periodLength;

    // Average daily exercise hours
    const average = sumArray(dailyExerciseHours) / periodLength;

    // Determine rating between 1-3 based on average
    const rating = rateExerciseWeek(average, target);

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription: ratingDescriptions[rating-1],
        target,
        average
    };
}

console.log(exerciseCalculator([3, 0, 2, 4.5, 0, 3, 1], 2))