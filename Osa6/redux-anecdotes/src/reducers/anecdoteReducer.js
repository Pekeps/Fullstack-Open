import { createSlice } from "@reduxjs/toolkit"

import anecdoteService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      return state.map(a => a.id !== action.payload.id ? a : action.payload)
        .sort((a, b) => {return b.votes - a.votes})
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => {return b.votes - a.votes})
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id, newObject) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.addVote(id, newObject)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer