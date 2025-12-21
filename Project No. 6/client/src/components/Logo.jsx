import './Logo.css'

function Logo({ text = 'MyApp', size = 'medium' }) {
  return (
    <div className={`logo logo-${size}`}>
      <span className="logo-text">{text}</span>
    </div>
  )
}

export default Logo

