import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'

import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
    const { setNotification } = useContext(NotificationContext)
    const queryClient = useQueryClient()

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (anecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(['anecdotes'], anecdotes.concat(anecdote))
            setNotification(`You created '${anecdote.content}'`, 5)
        },
        onError: (error) => {
            setNotification(error.message, 5)
        }
    })

    // Handler for adding a new anecdote
    const addAnecdote = event => {
        event.preventDefault()
        const content = event.target.anecdote.value

        // Validate anecdote length
        if (content.trim().length < 5) {
            setNotification('Anecdote must be at least 5 characters long', 5)
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