import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import anecdocteService from '../services/anecdotes'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    // Handler for adding a new anecdote
    const addAnecdote = event => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''

        anecdocteService.createNew(content).then(anecdote => {
            // Use the action creator to dispatch the action
            dispatch(createAnecdote(anecdote))
            dispatch(setNotification(`You created '${content}'`))
        })
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote" />
                </div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm