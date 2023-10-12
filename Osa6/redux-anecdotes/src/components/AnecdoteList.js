import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"


const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes.filter(a => 
    a.content.toLowerCase().includes(state.filter.toLowerCase())))

  const vote = (id) => {
    const object = anecdotes.find(a => a.id === id)
    const newObject = {...object, votes: object.votes + 1}
    dispatch(setNotification("Voted anecdote: \"" + object.content + "\"", 5))
    dispatch(voteAnecdote(id, newObject))
  }

  return (
    <ul>
      {anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </div>
      </div>
    )}
    </ul>
  )
}

export default AnecdoteList