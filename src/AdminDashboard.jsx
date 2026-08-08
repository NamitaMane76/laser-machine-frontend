import { useState, useEffect } from 'react'

function AdminDashboard({ username, password, onLogout }) {
  const [inquiries, setInquiries] = useState([])
  const [useCases, setUseCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [newUseCase, setNewUseCase] = useState({
    title: '', description: '', industry: '', imageUrl: ''
  })
  const [formStatus, setFormStatus] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '', description: '', industry: '', imageUrl: ''
  })

  const authHeader = { Authorization: `Basic ${btoa(`${username}:${password}`)}` }

  useEffect(() => {
    loadData()
  }, [])

  function loadData() {
    setLoading(true)
    Promise.all([
      fetch('http://localhost:8080/api/inquiries', { headers: authHeader }).then(r => r.json()),
      fetch('http://localhost:8080/api/usecases').then(r => r.json())
    ]).then(([inquiriesData, useCasesData]) => {
      setInquiries(inquiriesData)
      setUseCases(useCasesData)
      setLoading(false)
    })
  }

  function deleteInquiry(id) {
    fetch(`http://localhost:8080/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: authHeader
    }).then(loadData)
  }

  function deleteUseCase(id) {
    fetch(`http://localhost:8080/api/usecases/${id}`, {
      method: 'DELETE',
      headers: authHeader
    }).then(loadData)
  }

  function handleNewUseCaseChange(e) {
    setNewUseCase({ ...newUseCase, [e.target.name]: e.target.value })
  }

  function handleCreateUseCase(e) {
    e.preventDefault()
    setFormStatus('saving')

    fetch('http://localhost:8080/api/usecases', {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(newUseCase)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create')
        return res.json()
      })
      .then(() => {
        setFormStatus('success')
        setNewUseCase({ title: '', description: '', industry: '', imageUrl: '' })
        loadData()
      })
      .catch(() => setFormStatus('error'))
  }

  function startEditing(uc) {
    setEditingId(uc.id)
    setEditForm({
      title: uc.title,
      description: uc.description,
      industry: uc.industry,
      imageUrl: uc.imageUrl
    })
  }

  function cancelEditing() {
    setEditingId(null)
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  function saveEdit(id) {
    fetch(`http://localhost:8080/api/usecases/${id}`, {
      method: 'PUT',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update')
        setEditingId(null)
        loadData()
      })
      .catch(() => alert('Failed to update use case'))
  }

  if (loading) return <div className="admin-dashboard"><p>Loading...</p></div>

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout}>Log Out</button>
      </div>

      <section>
        <h2>Add New Use Case</h2>
        <form className="new-usecase-form" onSubmit={handleCreateUseCase}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newUseCase.title}
            onChange={handleNewUseCaseChange}
            required
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry (e.g. Jewelry, Medical)"
            value={newUseCase.industry}
            onChange={handleNewUseCaseChange}
            required
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={newUseCase.imageUrl}
            onChange={handleNewUseCaseChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            value={newUseCase.description}
            onChange={handleNewUseCaseChange}
            required
          />
          <button type="submit" disabled={formStatus === 'saving'}>
            {formStatus === 'saving' ? 'Saving...' : 'Add Use Case'}
          </button>
          {formStatus === 'success' && <p className="form-success">Use case added!</p>}
          {formStatus === 'error' && <p className="form-error">Something went wrong.</p>}
        </form>
      </section>

      <section>
        <h2>Inquiries ({inquiries.length})</h2>
        {inquiries.length === 0 ? (
          <p>No inquiries yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Message</th><th>Submitted</th><th></th></tr>
            </thead>
            <tbody>
              {inquiries.map(inq => (
                <tr key={inq.id}>
                  <td>{inq.name}</td>
                  <td>{inq.email}</td>
                  <td>{inq.message}</td>
                  <td>{new Date(inq.submittedAt).toLocaleString()}</td>
                  <td><button onClick={() => deleteInquiry(inq.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Use Cases ({useCases.length})</h2>
        <table>
          <thead>
            <tr><th>Title</th><th>Industry</th><th>Image URL</th><th></th></tr>
          </thead>
          <tbody>
            {useCases.map(uc => (
              editingId === uc.id ? (
                <tr key={uc.id} className="editing-row">
                  <td><input name="title" value={editForm.title} onChange={handleEditChange} /></td>
                  <td><input name="industry" value={editForm.industry} onChange={handleEditChange} /></td>
                  <td><input name="imageUrl" value={editForm.imageUrl} onChange={handleEditChange} /></td>
                  <td>
                    <button onClick={() => saveEdit(uc.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={uc.id}>
                  <td>{uc.title}</td>
                  <td>{uc.industry}</td>
                  <td className="url-cell">{uc.imageUrl}</td>
                  <td>
                    <button onClick={() => startEditing(uc)}>Edit</button>
                    <button onClick={() => deleteUseCase(uc.id)}>Delete</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminDashboard