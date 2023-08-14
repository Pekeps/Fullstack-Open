import { useState } from 'react'


const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
  }


  return <form onSubmit={addBlog}>
    <div>
      title
      <input
        id='title'
        value={newTitle}
        onChange={({ target }) => setNewTitle(target.value)}/>
    </div>
    <div>
      author
      <input
        id='author'
        value={newAuthor}
        onChange={({ target }) => setNewAuthor(target.value)}/>
    </div>
    <div>
      url
      <input
        id='url'
        value={newUrl}
        onChange={({ target }) => setNewUrl(target.value)}/>
    </div>
    <div>
      <button id='newBlog-button' type="submit">submit</button>
    </div>
  </form>
}

export default BlogForm