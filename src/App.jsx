import { useState, useEffect } from 'react'
import './App.css'
import ContactForm from './ContactForm'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

function App() {
  const [useCases, setUseCases] = useState([])
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminAuth, setAdminAuth] = useState(null)

  useEffect(() => {
    fetchUseCases()
  }, [industry])

  function fetchUseCases() {
    setLoading(true)
    const url = industry
      ? `http://localhost:8080/api/usecases?industry=${industry}`
      : 'http://localhost:8080/api/usecases'

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setUseCases(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching use cases:', err)
        setLoading(false)
      })
  }

  function handleLogin(username, password) {
    setAdminAuth({ username, password })
  }

  function handleLogout() {
    setAdminAuth(null)
    setShowAdmin(false)
  }

  const industries = ['Jewelry', 'Retail', 'Medical', 'Industrial', 'Art', 'Consumer']

  if (showAdmin) {
    if (!adminAuth) {
      return <AdminLogin onLogin={handleLogin} />
    }
    return (
      <AdminDashboard
        username={adminAuth.username}
        password={adminAuth.password}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>Laser Machine Innovation Hub</h1>
        <p>Discover the endless possibilities of precision laser technology</p>
        <button className="admin-link" onClick={() => setShowAdmin(true)}>Admin Login</button>
      </header>

      <section className="filters">
        <button
          className={industry === '' ? 'active' : ''}
          onClick={() => setIndustry('')}
        >
          All
        </button>
        {industries.map(ind => (
          <button
            key={ind}
            className={industry === ind ? 'active' : ''}
            onClick={() => setIndustry(ind)}
          >
            {ind}
          </button>
        ))}
      </section>

      <section className="gallery">
        {loading ? (
          <p>Loading...</p>
        ) : useCases.length === 0 ? (
          <p>No use cases found.</p>
        ) : (
          useCases.map(uc => (
            <div className="card" key={uc.id}>
              <img src={uc.imageUrl} alt={uc.title} />
              <h3>{uc.title}</h3>
              <span className="tag">{uc.industry}</span>
              <p>{uc.description}</p>
            </div>
          ))
        )}
      </section>

      <ContactForm />
    </div>
  )
}

export default App