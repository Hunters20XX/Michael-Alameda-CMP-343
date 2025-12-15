import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Items.css'

function Items() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch items from API
    fetchItems()
  }, [])

  useEffect(() => {
    // Filter items based on search and category
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory)
    }

    setFilteredItems(filtered)
  }, [searchTerm, filterCategory, items])

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/items')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
        setFilteredItems(data)
      } else {
        // Fallback to mock data if API is not available
        setItems(mockItems)
        setFilteredItems(mockItems)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      // Fallback to mock data
      setItems(mockItems)
      setFilteredItems(mockItems)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(items.map(item => item.category).filter(Boolean))]

  if (loading) {
    return <div className="loading">Loading items...</div>
  }

  return (
    <div className="items-page">
      <div className="items-header">
        <h1>Items</h1>
        <Link to="/items/new" className="btn btn-primary">
          Add New Item
        </Link>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filter">
          <label htmlFor="category">Category: </label>
          <select
            id="category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>No items found. Try adjusting your filters or add a new item.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <Link key={item.id} to={`/items/${item.id}`} className="item-card">
              <div className="item-card-header">
                <h3>{item.name}</h3>
                {item.category && (
                  <span className="item-category">{item.category}</span>
                )}
              </div>
              {item.description && (
                <p className="item-description">{item.description}</p>
              )}
              {item.price && (
                <div className="item-price">${item.price}</div>
              )}
            </Link>
          ))
        )}
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

export default Items

