import { useDispatch, useSelector } from "react-redux"
import { addVote } from "../reducers/anecdoteReducer"
import { notificationChange } from "../reducers/notificationReducer"


const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes.filter(a => 
    a.content.toLowerCase().includes(state.filter.toLowerCase())))

  const vote = (id) => {
    dispatch(addVote(id))
    const content = anecdotes.find(a => a.id === id).content
    dispatch(notificationChange("Voted anecdote: \"" + content + "\""))
    setTimeout(() => {
      dispatch(notificationChange(""))
    }, 5000)
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