import { useSelector, useDispatch } from 'react-redux'
import { filterAnecdotes } from '../reducers/filterReducer'

const Filter = () => {
    const dispatch = useDispatch()
    const filter = useSelector(state => state.filter)

    const handleChange = (event) => {
        const query = event.target.value
        event.target.value = ''

        // Use the action creator to dispatch the action
        dispatch(filterAnecdotes(query))
    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input name="filter" value={filter} onChange={handleChange} />
        </div>
    )
}

export default Filter