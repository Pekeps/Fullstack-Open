import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Toggleble'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

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
      blogService.setToken(user.token)
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

  const addBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(response))
      setMessage(`added ${blogObject.title} by ${blogObject.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    } catch (exception) { /* empty */ }
  }

  const updateBlogById = id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes += 1 }
    console.log(changedBlog)
    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(() => {
        setErrorMessage( 'Blog wass allready removed from server')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== id))
      })
  }

  const deleteBlogById = id => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Delete ${blog.title}`)) {
      blogService.deleteBlog(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
        })
    }
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


  const sortedBlogs = [...blogs]
  sortedBlogs.sort((a, b) => b.likes - a.likes)


  return (
    <>
      <h1>Blog app</h1>
      <ErrorNotification message={errorMessage} />
      <Notification message={message} />


      {!user &&
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
      }
      {user &&
      <div>
        <h2>Logged in as {user.name}</h2>

        <button onClick={() => {
          window.localStorage.clear()
          window.location.reload()
        }}>
          log out
        </button>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <h2>New blog</h2>
          <BlogForm createBlog={addBlog}/>
        </Togglable>

        <h2>blogs</h2>
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={() => updateBlogById(blog.id)}
            deleteBlog={() => deleteBlogById(blog.id)}
            isCreator={user.name === blog.name ? true : false}
          />
        )}
      </div>
      }
    </>
  )

}

export default App