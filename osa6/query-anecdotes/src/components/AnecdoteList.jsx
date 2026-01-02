import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { voteAnecdote } from '../requests'

const AnecdoteList = ({ anecdotes }) => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const filter = useSelector(state => state.filter)

    const voteAnecdoteMutation = useMutation({
        mutationFn: voteAnecdote,
        onSuccess: (anecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(
                ['anecdotes'],
                anecdotes.map(a => a.id === anecdote.id ? anecdote : a)
            )
            dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
        },
    })

    const filteredAnecdotes = anecdotes
        .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))

    return (
        <div>
            {filteredAnecdotes
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