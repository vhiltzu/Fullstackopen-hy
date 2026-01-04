function calculateBmi(height: number, weight: number): string {
    const heightInMeters = height / 100;
    const bmi = weight / Math.pow(heightInMeters, 2); // kg/m^2

    // Based on the Wikipedia BMI categories
    // three main categories are in use
    if (bmi < 18.5) {
        return 'Underweight';
    }
    
    if (bmi < 25) {
        return 'Normal weight';
    }
    
    return 'Overweight';
}


console.log(calculateBmi(180, 74))