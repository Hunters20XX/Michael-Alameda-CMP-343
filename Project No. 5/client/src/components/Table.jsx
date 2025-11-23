import React from 'react'

const TableHeader = () => {
  // boilerplate table header functional component
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>URL</th>
        <th>Actions</th>
      </tr>
    </thead>
  )
}

const TableBody = (props) => {
  // boilerplate table body functional component
  // we use Array.map to create table rows from LinkData passed via props
  const rows = props.linkData.map((row, index) => {
    return (
      <tr key={row.id || index}>
        <td>{row.name}</td>
        <td>
          <a href={row.URL} target="_blank" rel="noopener noreferrer">{row.URL}</a>
        </td>
        <td>
          {props.editLink && (
            <button onClick={() => props.editLink(row)} style={{ marginRight: '10px' }}>
              Edit
            </button>
          )}
          <button onClick={() => props.removeLink(index)}>Delete</button>
        </td>
      </tr>
    )
  })

  return <tbody>{rows}</tbody>
}

const Table = (props) => {
  return (
    <table>
      <TableHeader />
      <TableBody 
        linkData={props.linkData} 
        removeLink={props.removeLink}
        editLink={props.editLink}
      />
    </table>
  )
}

export default Table

