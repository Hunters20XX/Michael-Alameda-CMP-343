import './Sidebar.css'
import Card from './Card'

function Sidebar({ currentPage, onNavigate }) {
  const handleClick = (e, page) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(page)
    }
  }

  const sidebarItems = [
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Settings', page: 'settings' },
    { label: 'Profile', page: 'profile' }
  ]

  return (
    <aside className="sidebar">
      <Card title="Menu">
        <ul className="sidebar-list">
          {sidebarItems.map((item, index) => (
            <li key={index} className="sidebar-item">
              <a 
                href={`#${item.page}`} 
                className={`sidebar-link ${currentPage === item.page ? 'active' : ''}`}
                onClick={(e) => handleClick(e, item.page)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  )
}

export default Sidebar

