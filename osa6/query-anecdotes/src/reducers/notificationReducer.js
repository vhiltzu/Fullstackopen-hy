import { createSlice } from "@reduxjs/toolkit"

const initialState = ""
let timerId = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(_state, action) {
            return action.payload
        },
        resetNotification() {
            return ""
        }
    },
})

export const setNotification = (message, timeInSeconds) => {
    return (dispatch) => {
        dispatch(notificationSlice.actions.setNotification(message))

        // Clear any existing timer
        if (timerId) {
            clearTimeout(timerId)
        }

        // Clear the notification after the specified time
        timerId = setTimeout(() => {
            dispatch(notificationSlice.actions.resetNotification())
        }, timeInSeconds * 1000)
    }
}

export default notificationSlice.reducer