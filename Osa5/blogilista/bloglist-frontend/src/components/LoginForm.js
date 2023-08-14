  const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
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

  export default LoginForm