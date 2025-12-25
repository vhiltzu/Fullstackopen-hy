import { useState } from 'react'
import Statistics from "./Statistics";

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodFeedbackClick = () => {
    setGood(good + 1)
  }

  const handleNeutralFeedbackClick = () => {
    setNeutral(neutral + 1)
  }
  
  const handleBadFeedbackClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={handleGoodFeedbackClick}>good</button>
      <button onClick={handleNeutralFeedbackClick}>neutral</button>
      <button onClick={handleBadFeedbackClick}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App