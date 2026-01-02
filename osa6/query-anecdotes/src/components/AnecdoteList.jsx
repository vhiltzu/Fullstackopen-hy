import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { voteAnecdote } from '../requests'

import NotificationContext from '../NotificationContext'

const AnecdoteList = ({ anecdotes }) => {
    const queryClient = useQueryClient()
    const { setNotification } = useContext(NotificationContext)

    const voteAnecdoteMutation = useMutation({
        mutationFn: voteAnecdote,
        onSuccess: (anecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(
                ['anecdotes'],
                anecdotes.map(a => a.id === anecdote.id ? anecdote : a)
            )
            setNotification(`You voted '${anecdote.content}'`, 5)
        },
        onError: (error) => {
            setNotification(error.message, 5)
        }
    })

    return (
        <div>
            {anecdotes
                .map(anecdote => (
                    <div key={anecdote.id}>
                        <div>{anecdote.content}</div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => voteAnecdoteMutation.mutate(anecdote)}>vote</button>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default AnecdoteList