import { createContext } from 'react'
import { useReducer } from 'react'

import notificationReducer from './reducers/notificationReducer'

const NotificationContext = createContext()
let timerId = null

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')

    const setNotification = (message, timeInSeconds) => {
        notificationDispatch({ type: "SET", payload: message })

        // Clear any existing timer
        if (timerId) {
            clearTimeout(timerId)
        }

        // Clear the notification after the specified time
        timerId = setTimeout(() => {
            notificationDispatch({ type: "RESET" })
        }, timeInSeconds * 1000)
    }

    return (
        <NotificationContext.Provider value={{ notification, setNotification }}>
            {props.children}
        </NotificationContext.Provider>
    )
}


export default NotificationContext