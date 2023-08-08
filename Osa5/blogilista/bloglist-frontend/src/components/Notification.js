const Notification = ({ message }) => {
  console.log('notification')
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default { Notification }