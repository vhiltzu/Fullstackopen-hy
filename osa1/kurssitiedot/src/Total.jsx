const Total = (props) => {
  const sumExercises = (parts) => {
    let total = 0
    for (const part of parts) {
      total += part.exercises
    }
    return total
  }

  return (
    <p>Number of exercises {sumExercises(props.parts)}</p>
  )
}

export default Total