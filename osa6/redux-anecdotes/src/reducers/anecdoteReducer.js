import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    vote(state, action) {
      return state.map(anecdote =>
        anecdote.id !== action.payload.id ? anecdote : action.payload
      ).sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(_state, action) {
      return action.payload
    }
  }
})

export const { setAnecdotes } = anecdoteSlice.actions
const { createAnecdote, vote } = anecdoteSlice.actions

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    return dispatch(createAnecdote(newAnecdote))
  }
}
export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.vote(anecdote)
    return dispatch(vote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer
