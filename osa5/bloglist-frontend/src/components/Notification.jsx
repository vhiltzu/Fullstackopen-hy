import { useEffect } from 'react'

const Notification = (props) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      props.dismiss()
    }, 5_000)

    return () => clearTimeout(timeout)
  }, [props])

  if (props.kind === 'error') {
    return (
      <div
        style={{
          color: 'red',
          background: 'lightgrey',
          fontSize: '1.5em',
          padding: '0.33em',
          border: '2px solid red',
          borderRadius: '0.33em',
          margin: '0.5em 0',
        }}
      >
        {props.message}
      </div>
    )
  }

  if (props.kind === 'success') {
    return (
      <div
        style={{
          color: 'green',
          background: 'lightgrey',
          fontSize: '1.5em',
          padding: '0.33em',
          border: '2px solid green',
          borderRadius: '0.33em',
          margin: '0.5em 0',
        }}
      >
        {props.message}
      </div>
    )
  }

  return null
}

export default Notification
