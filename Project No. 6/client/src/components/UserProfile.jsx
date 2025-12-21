import { useState } from 'react'
import Card from './Card'
import Button from './Button'
import './UserProfile.css'

function UserProfile({ name, email, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes)

  const handleLike = () => {
    setLikes(likes + 1)
  }

  return (
    <Card title="User Profile">
      <div className="user-profile">
        <div className="user-info">
          <div className="avatar">{name.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <h3>{name}</h3>
            <p className="user-email">{email}</p>
          </div>
        </div>
        <div className="user-actions">
          <Button onClick={handleLike} variant="primary">
            Like ({likes})
          </Button>
          <Button variant="secondary">Message</Button>
        </div>
      </div>
    </Card>
  )
}

export default UserProfile

