import './Nav.css'
import Logo from './Logo'

function Nav({ items = [], currentPage, onNavigate }) {
  const defaultItems = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Contact', page: 'contact' }
  ]

  const navItems = items.length > 0 ? items : defaultItems

  const handleClick = (e, page) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(page)
    }
  }

  return (
    <nav className="nav">
      <div className="nav-left">
        <div className="nav-logo">
          <Logo text="MyApp" size="medium" />
        </div>
        <ul className="nav-list">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <a 
                href={`#${item.page || item.href || '#'}`} 
                className={`nav-link ${currentPage === item.page ? 'active' : ''}`}
                onClick={(e) => item.page && handleClick(e, item.page)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Nav

