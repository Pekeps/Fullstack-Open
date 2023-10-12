import { createAnecdote } from "../reducers/anecdoteReducer"
import { useDispatch } from "react-redux"
import { notificationChange } from "../reducers/notificationReducer"
import anecdoteService from "../services/anecdotes"


const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {    
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(notificationChange("Added anecdote: \"" + content + "\""))
    setTimeout(() => {
      dispatch(notificationChange(""))
    }, 5000)
    const newAnecdote = await anecdoteService.createNew(content)
    console.log(newAnecdote)
    dispatch(createAnecdote(newAnecdote))
  }

  return (
    <div>
      <h2>create new</h2>
        <form onSubmit={addAnecdote}>
          <div><input name="anecdote" /></div>
          <button type="submit">create</button>
      </form>
    </div>
  )
}
  
export default AnecdoteForm