import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from './reducers/anecdoteReducer'


const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state)

    const vote = id => {
        dispatch(voteAnecdote(id))
    }

    // Handler for adding a new anecdote
    const addAnecdote = event => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''

        // Use the action creator to dispatch the action
        dispatch(createAnecdote(content))
    }

    return (
        <div>
            {anecdotes.map(anecdote => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteForm