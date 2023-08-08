import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    try {
    const response = await blogService.create(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setBlogs(blogs.concat(response))
    setMessage(`added ${blogObject.title} by ${blogObject.author}`)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
    } catch (exception) {}
  }

  const loginForm = () => {
    return <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)} />
      </div>
      <div>
        <button type="submit">login</button>
      </div>


    </form>
  }

  const blogForm = () => {
    return <form onSubmit={addBlog}>
      <div>
        title
        <input
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}/>
      </div>
      <div>
        author
        <input
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}/>
      </div>
      <div>
        url
        <input
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}/>
      </div>
      <div>
      <button type="submit">submit</button>
      </div>
    </form>
  }

  const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="notification">
        {message}
      </div>
    )
  }




  return (
    <>
    <h1>Blog app</h1>
    <ErrorNotification message={errorMessage} />
    <Notification message={message} />


    {!user && loginForm()}
    {user &&
      <div>
        <h2>Logged in as {user.name}</h2>
        <button onClick={() => {
          window.localStorage.clear()
          window.location.reload()
        }}>
          log out
        </button>
        {blogForm()}
        <h2>blogs</h2>
          {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      }
  </>
)

}

export default App