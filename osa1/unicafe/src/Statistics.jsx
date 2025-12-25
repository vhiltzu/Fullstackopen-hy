const Statistics = (props) => {
  const all = props.good + props.bad * -1; // good = 1, neutral = 0, bad = -1
  const avg = all / (props.good + props.neutral + props.bad);
  const positive =
    (props.good / (props.good + props.neutral + props.bad)) * 100;

  return (
    <div>
      <h1>statistics</h1>
      <div>good {props.good}</div>
      <div>neutral {props.neutral}</div>
      <div>bad {props.bad}</div>
      <div>all {all}</div>
      <div>average {avg}</div>
      <div>positive {positive} %</div>
    </div>
  );
};

export default Statistics;
