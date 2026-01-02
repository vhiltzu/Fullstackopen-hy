import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)

  useEffect(() => {
    // Do nothing if there's no notification
    if (notification === '') {
      return
    }

    // Clear the notification after displaying it
    const timeoutId = setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [notification])

  if (notification === '') {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return <div style={style}>{notification}</div>
}

export default Notification
