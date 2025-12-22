import './Sidebar.css'
import Card from './Card'

function Sidebar({ currentPage, onNavigate, isOpen, onClose }) {
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
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Card title="Menu">
          <ul className="sidebar-list">
            {sidebarItems.map((item, index) => (
              <li key={index} className="sidebar-item">
                <a
                  href={`#${item.page}`}
                  className={`sidebar-link ${currentPage === item.page ? 'active' : ''}`}
                  onClick={(e) => {
                    handleClick(e, item.page);
                    if (window.innerWidth <= 768) {
                      onClose();
                    }
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </>
  )
}

export default Sidebar

