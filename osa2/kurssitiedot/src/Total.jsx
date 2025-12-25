const Total = (props) => {
  // Calculate the total number of exercises
  const sum = (sum, part) => {
    return sum + part.exercises;
  };

  const total = props.parts.reduce(sum, 0);

  return (
    <p>
      <b>total of {total} exercises</b>
    </p>
  );
};

export default Total;
