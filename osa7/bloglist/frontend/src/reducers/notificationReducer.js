const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return { ...action.payload }
        case 'RESET':
            return { message: "", kind: "" }
        default:
            return state
    }
}

export default notificationReducer