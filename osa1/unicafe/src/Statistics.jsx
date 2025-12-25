import StatisticLine from "./StatisticLine";

const Statistics = (props) => {
  const all = props.good + props.bad * -1; // good = 1, neutral = 0, bad = -1
  const avg = all / (props.good + props.neutral + props.bad);
  const positive =
    (props.good / (props.good + props.neutral + props.bad)) * 100;

  if (all === 0) {
    return <div>No feedback given</div>;
  }

  return (
    <div>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={avg} />
      <StatisticLine text="positive" value={positive + " %"} />
    </div>
  );
};

export default Statistics;
