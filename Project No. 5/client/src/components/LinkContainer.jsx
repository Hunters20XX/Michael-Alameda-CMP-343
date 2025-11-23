import { useEffect, useState } from 'react'
import Table from './Table'
import Form from './Form'

const LinkContainer = (props) => {
  const [favLinks, setFavLinks] = useState([])
  const [editingLink, setEditingLink] = useState(null)

  const fetchLinks = async () => {
    try {
      const response = await fetch('/links')
      if (!response.ok) {
        throw new Error('Failed to fetch links')
      }
      const data = await response.json()
      setFavLinks(data)
    } catch (error) {
      console.error('Error fetching links:', error)
    }
  }

  const handleSubmit = async (favLink) => {
    try {
      if (editingLink) {
        // Update existing link
        await handleUpdate(editingLink.id, favLink)
        setEditingLink(null)
      } else {
        // Create new link
        const response = await fetch('/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(favLink)
        })
        
        if (!response.ok) {
          throw new Error('Failed to create link')
        }
        
        // Refresh the links list after adding a new link
        await fetchLinks()
      }
    } catch (error) {
      console.error('Error creating/updating link:', error)
    }
  }

  const handleRemove = async (index) => {
    const linkToRemove = favLinks[index]
    
    // Optimistically update UI
    setFavLinks(favLinks.filter((_, i) => i !== index))
    
    try {
      const response = await fetch(`/links/${linkToRemove.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      // Restore the link if deletion failed
      setFavLinks(favLinks)
      alert('Failed to delete link. Please try again.')
    }
  }

  const handleUpdate = async (id, updatedLink) => {
    try {
      const response = await fetch(`/links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLink)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update link')
      }
      
      // Refresh the links list after updating
      await fetchLinks()
    } catch (error) {
      console.error('Error updating link:', error)
      alert('Failed to update link. Please try again.')
    }
  }

  const handleEdit = (link) => {
    setEditingLink(link)
  }

  const handleCancelEdit = () => {
    setEditingLink(null)
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  return (
    <div className="container">
      <h1>My Favorite Links</h1>
      <p>Add a new url with a name and link to the table.</p>
      <Table linkData={favLinks} removeLink={handleRemove} editLink={handleEdit} />

      <br />

      <h3>{editingLink ? 'Edit Link' : 'Add New'}</h3>
      <Form 
        handleSubmit={handleSubmit} 
        editingLink={editingLink}
        handleCancel={handleCancelEdit}
      />
    </div>
  )
}

export default LinkContainer

