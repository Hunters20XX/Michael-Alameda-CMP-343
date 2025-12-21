import { useState } from 'react'
import './Profile.css'
import Card from './Card'
import Button from './Button'

function Profile() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Web developer passionate about React and modern JavaScript. Love building user-friendly applications.',
    location: 'New York, USA',
    website: 'https://johndoe.dev',
    joinDate: 'January 2023'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(profile)

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{profile.name}</h1>
          <p className="profile-email">{profile.email}</p>
          <p className="profile-join-date">Member since {profile.joinDate}</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              Edit Profile
            </Button>
          ) : (
            <div className="edit-actions">
              <Button onClick={handleSave} variant="success">
                Save
              </Button>
              <Button onClick={handleCancel} variant="secondary">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <Card title="About">
          {isEditing ? (
            <textarea
              className="profile-input"
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              rows="4"
            />
          ) : (
            <p className="profile-bio">{profile.bio}</p>
          )}
        </Card>

        <Card title="Contact Information">
          <div className="profile-details">
            <div className="profile-detail-item">
              <span className="detail-label">Location:</span>
              {isEditing ? (
                <input
                  className="profile-input"
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              ) : (
                <span className="detail-value">{profile.location}</span>
              )}
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Website:</span>
              {isEditing ? (
                <input
                  className="profile-input"
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                />
              ) : (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="detail-link">
                  {profile.website}
                </a>
              )}
            </div>
          </div>
        </Card>

        <Card title="Account Statistics">
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="stat-number">24</div>
              <div className="stat-label">Posts</div>
            </div>
            <div className="profile-stat">
              <div className="stat-number">89</div>
              <div className="stat-label">Followers</div>
            </div>
            <div className="profile-stat">
              <div className="stat-number">156</div>
              <div className="stat-label">Following</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile

