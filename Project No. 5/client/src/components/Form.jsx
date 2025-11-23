import { useState, useEffect } from 'react'

const Form = (props) => {
  const [name, setName] = useState('')
  const [URL, setURL] = useState('')

  // Update form fields when editingLink changes
  useEffect(() => {
    if (props.editingLink) {
      setName(props.editingLink.name)
      setURL(props.editingLink.URL)
    } else {
      setName('')
      setURL('')
    }
  }, [props.editingLink])

  const handleChange = (event) => {
    if (event.target.name === 'name') {
      setName(event.target.value)
    } else if (event.target.name === 'URL') {
      setURL(event.target.value)
    }
  }

  const onFormSubmit = (event) => {
    // to prevent page reload on form submit
    event.preventDefault()

    // Call the handleSubmit function passed from parent with the form data
    props.handleSubmit({ name, URL })
    
    // Reset form fields only if not editing
    if (!props.editingLink) {
      setName('')
      setURL('')
    }
  }

  const handleCancel = () => {
    if (props.handleCancel) {
      props.handleCancel()
    }
    setName('')
    setURL('')
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={handleChange}
        required
      />
      <label htmlFor="URL">URL:</label>
      <input
        type="url"
        id="URL"
        name="URL"
        value={URL}
        onChange={handleChange}
        required
      />
      <button type="submit">{props.editingLink ? 'Update' : 'Submit'}</button>
      {props.editingLink && (
        <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      )}
    </form>
  )
}

export default Form

