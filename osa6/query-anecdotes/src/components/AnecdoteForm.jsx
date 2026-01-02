import { useDispatch } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setNotification } from '../reducers/notificationReducer'
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (anecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.concat(anecdote))
            dispatch(setNotification(`You created '${anecdote.content}'`, 5))
        },
    })

    // Handler for adding a new anecdote
    const addAnecdote = event => {
        event.preventDefault()
        const content = event.target.anecdote.value

        // Validate anecdote length
        if (content.trim().length < 5) {
            dispatch(setNotification('Anecdote must be at least 5 characters long', 5))
            return
        }

        // Clear the input field
        event.target.anecdote.value = ''

        newAnecdoteMutation.mutate({ content, votes: 0 })
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