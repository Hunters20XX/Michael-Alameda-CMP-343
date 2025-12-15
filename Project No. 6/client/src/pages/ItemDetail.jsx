import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './ItemDetail.css'

function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchItem()
  }, [id])

  const fetchItem = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/items/${id}`)
      if (response.ok) {
        const data = await response.json()
        setItem(data)
      } else {
        // Fallback to mock data
        const mockItem = mockItems.find(i => i.id === parseInt(id))
        if (mockItem) {
          setItem(mockItem)
        } else {
          setError('Item not found')
        }
      }
    } catch (error) {
      console.error('Error fetching item:', error)
      // Fallback to mock data
      const mockItem = mockItems.find(i => i.id === parseInt(id))
      if (mockItem) {
        setItem(mockItem)
      } else {
        setError('Item not found')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading item details...</div>
  }

  if (error || !item) {
    return (
      <div className="error-container">
        <p>{error || 'Item not found'}</p>
        <Link to="/items" className="btn btn-primary">
          Back to Items
        </Link>
      </div>
    )
  }

  return (
    <div className="item-detail-page">
      <Link to="/items" className="back-link">← Back to Items</Link>
      
      <div className="item-detail-card">
        <div className="item-detail-header">
          <h1>{item.name}</h1>
          {item.category && (
            <span className="item-category">{item.category}</span>
          )}
        </div>

        {item.description && (
          <div className="item-detail-section">
            <h2>Description</h2>
            <p>{item.description}</p>
          </div>
        )}

        {item.price && (
          <div className="item-detail-section">
            <h2>Price</h2>
            <p className="item-price-large">${item.price}</p>
          </div>
        )}

        <div className="item-detail-actions">
          <button
            onClick={() => navigate('/items')}
            className="btn btn-secondary"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  )
}

// Mock data for fallback
const mockItems = [
  { id: 1, name: 'Sample Item 1', description: 'This is a sample item', category: 'electronics', price: 99.99 },
  { id: 2, name: 'Sample Item 2', description: 'Another sample item', category: 'books', price: 19.99 },
  { id: 3, name: 'Sample Item 3', description: 'Yet another sample', category: 'electronics', price: 149.99 },
]

export default ItemDetail

