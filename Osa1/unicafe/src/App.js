mport { useState } from 'react'

const StatisticLine = ({ text, value }) =>
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>

const Statistics = ({good, bad, neutral}) => {
  if (good + bad + neutral === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return(
    <table>
      <tbody>
       <StatisticLine text='good' value={good} />
       <StatisticLine text='neutral' value={neutral} />
       <StatisticLine text='bad' value={bad} />
       <StatisticLine text='all' value={good + bad + neutral} />
       <StatisticLine text='average' value={(good - bad) / (good + bad + neutral)}  />
       <StatisticLine text='positive' value={good * 100 / (good + bad + neutral)} />    
      </tbody>
    </table>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = newValue => {
    console.log('good reviews', newValue)
    setGood(newValue)
  }
  const setToNeutral = newValue => {
    console.log('neutral reviews', newValue)
    setNeutral(newValue)
  }
  const setToBad = newValue => {
    console.log('bad reviews', newValue)
    setBad(newValue)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setToGood(good + 1)} text='good' />
      <Button handleClick={() => setToNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setToBad(bad + 1)} text='bad' />

      <h1>statistics</h1>
      
      <Statistics good={good} bad={bad} neutral={neutral} />
      
    </div>
  )
}

export default App
