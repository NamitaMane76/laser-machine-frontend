import { useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL
function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const credentials = btoa(`${username}:${password}`)

    fetch(`${API_URL}/api/inquiries`, {
      headers: { Authorization: `Basic ${credentials}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid credentials')
        onLogin(username, password)
      })
      .catch(() => setError('Invalid username or password'))
  }

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  )
}

export default AdminLogin