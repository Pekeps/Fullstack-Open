import { useState } from 'react'

const Button = (props) => {
  return (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [points, setPoints] = useState({0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0})
  const [selected, setSelected] = useState(0)

  const addVote = () => {
    const copy = {...points}
    copy[selected] += 1
    setPoints(copy)
    console.log(points)
  }

  const anecdoteWithMostVotes = Object.entries(points).reduce((a,points) => a[1] > points[1] ? a : points)[0]
  console.log(anecdoteWithMostVotes)
  

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br></br>
      has {points[selected]} votes
      <br></br>
      <Button handleClick={() => setSelected(Math.floor(Math.random() * 8))} text='next anecdote' />
      <Button handleClick={() => addVote()} 
      text='add vote' />

      <h1>Anecdote with most votes</h1>
      {anecdotes[anecdoteWithMostVotes]}
    </div>
  )
}

export default App