import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from './requests'

import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  const result = useQuery(
    {
      queryKey: ['anecdotes'],
      queryFn: getAnecdotes,
      retry: false,
      refetchOnWindowFocus: false
    }
  )

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to server problems</div>
  }

  const anecdotes = result.data.sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteList anecdotes={anecdotes} />
      <AnecdoteForm />
    </div>
  )
}

export default App
