import { useState } from 'react'
import './Settings.css'
import Card from './Card'
import Button from './Button'

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showLocation: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC-5'
    }
  })

  const handleNotificationChange = (type) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type]
      }
    })
  }

  const handlePrivacyChange = (key, value) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    })
  }

  const handlePreferenceChange = (key, value) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    })
  }

  const handleSave = () => {
    alert('Settings saved successfully!')
  }

  return (
    <div className="settings">
      <h1 className="settings-title">Settings</h1>

      <Card title="Notifications">
        <div className="settings-group">
          <label className="settings-item">
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={() => handleNotificationChange('email')}
            />
            <span>Email Notifications</span>
          </label>
          <label className="settings-item">
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={() => handleNotificationChange('push')}
            />
            <span>Push Notifications</span>
          </label>
          <label className="settings-item">
            <input
              type="checkbox"
              checked={settings.notifications.sms}
              onChange={() => handleNotificationChange('sms')}
            />
            <span>SMS Notifications</span>
          </label>
        </div>
      </Card>

      <Card title="Privacy Settings">
        <div className="settings-group">
          <div className="settings-item">
            <label>Profile Visibility:</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="settings-select"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <label className="settings-item">
            <input
              type="checkbox"
              checked={settings.privacy.showEmail}
              onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
            />
            <span>Show Email Address</span>
          </label>
          <label className="settings-item">
            <input
              type="checkbox"
              checked={settings.privacy.showLocation}
              onChange={(e) => handlePrivacyChange('showLocation', e.target.checked)}
            />
            <span>Show Location</span>
          </label>
        </div>
      </Card>

      <Card title="Preferences">
        <div className="settings-group">
          <div className="settings-item">
            <label>Theme:</label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="settings-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="settings-item">
            <label>Language:</label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="settings-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div className="settings-item">
            <label>Timezone:</label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="settings-select"
            >
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC-8">UTC-8 (PST)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+1">UTC+1 (CET)</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Account Actions">
        <div className="settings-actions">
          <Button onClick={handleSave} variant="primary">
            Save Settings
          </Button>
          <Button variant="secondary">
            Reset to Defaults
          </Button>
          <Button variant="secondary" style={{ backgroundColor: '#f44336', color: 'white' }}>
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Settings

