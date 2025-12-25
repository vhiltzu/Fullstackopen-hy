import { useState } from 'react'
import Statistics from "./Statistics";
import Button from "./Button";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  const all = props.good + props.bad * -1; // good = 1, neutral = 0, bad = -1
  const avg = all / (props.good + props.neutral + props.bad);
  const positive =
    (props.good / (props.good + props.neutral + props.bad)) * 100;

  if (all === 0) {
    return <div>No feedback given</div>;
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={props.good} />
        <StatisticLine text="neutral" value={props.neutral} />
        <StatisticLine text="bad" value={props.bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={avg} />
        <StatisticLine text="positive" value={positive + " %"} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // Maybe these handlers could be in button component itself and passed the state setters as props...
  const handleGoodFeedbackClick = () => {
    setGood(good + 1);
  };

  const handleNeutralFeedbackClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadFeedbackClick = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodFeedbackClick} text="good" />
      <Button onClick={handleNeutralFeedbackClick} text="neutral" />
      <Button onClick={handleBadFeedbackClick} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App