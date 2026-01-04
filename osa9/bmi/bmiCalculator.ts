import { isNotNumber } from "./utils";

export function calculateBmi(height: number, weight: number): string {
    const heightInMeters = height / 100;
    const bmi = weight / Math.pow(heightInMeters, 2); // kg/m^2

    // Based on the Wikipedia BMI categories
    // three main categories are in use
    if (bmi < 18.5) {
        return 'Underweight';
    }
    
    if (bmi < 25) {
        return 'Normal range';
    }
    
    return 'Overweight';
}

// Ensure this file can be run directly from command line
// but not when imported as a module
if (require.main === module) {
    // Read command line arguments
    if (process.argv.slice(2).length < 2 || process.argv.slice(2).some(isNotNumber)) {
        console.error('Not enough arguments provided. Please provide height (cm) and weight (kg).');
        process.exit(1);
    }

    console.log(calculateBmi(Number(process.argv[2]), Number(process.argv[3])));
}