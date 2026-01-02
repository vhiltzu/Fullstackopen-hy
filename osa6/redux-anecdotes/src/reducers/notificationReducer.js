import { createSlice } from "@reduxjs/toolkit"

const initialState = { notification: "", timerId: null }

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(_state, action) {
            return { notification: action.payload }
        },
        resetNotification() {
            return { notification: "", timerId: null }
        },
        setTimerId(_state, action) {
            return { timerId: action.payload }
        }
    }
})

export const setNotification = (message, timeInSeconds) => {
    return (dispatch) => {
        dispatch(notificationSlice.actions.setNotification(message))

        // Clear any existing timer
        if (notificationSlice.reducer.timerId) {
            clearTimeout(notificationSlice.reducer.timerId)
        }

        // Clear the notification after the specified time
        const timerId = setTimeout(() => {
            dispatch(notificationSlice.actions.resetNotification())
        }, timeInSeconds * 1000)

        dispatch(notificationSlice.actions.setTimerId(timerId))
    }
}

// Return the notification only, not the timerId
export default { notification: notificationSlice.reducer.notification }