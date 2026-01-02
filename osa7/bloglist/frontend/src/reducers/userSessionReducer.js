const userSessionReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return { ...action.payload }
        case 'RESET':
            return null
        default:
            return state
    }
}

export default userSessionReducer