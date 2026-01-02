const initialState = ""

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export const filterAnecdotes = query => ({
  type: 'SET_FILTER',
  payload: query
})

export default reducer
