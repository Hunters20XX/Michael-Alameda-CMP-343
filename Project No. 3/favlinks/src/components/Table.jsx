function TableHeader(){
    /* responsible for rendering the head of our table with the appropriate columns */
    return(
        <thead>
            <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Remove</th>
            </tr>
        </thead>
    )
}

const TableBody = (props) => {
    // boilerplate table body functional component, we use Array.map to create table rows from LinkData passed via props.
    const rows = props.linkData.map((row, index) => {
        return (
            <tr key={index}>
                <td>{row.name}</td>
                <td>
                    <a href={row.URL}>{row.URL}</a>
                </td>
                <td>
                    <button onClick={() => props.removeLink(index)}>Delete</button>
                </td>
            </tr>
        )
    })
    return <tbody>{rows}</tbody>
}

function Table(props){
    const handleRemove = (index) => {
        console.log("button clicked", index)
    }

    return(
        <table>
        <TableHeader/>
        <TableBody linkData={props.data} removeLink={handleRemove}/>
        </table>
    )
}

export default Table
