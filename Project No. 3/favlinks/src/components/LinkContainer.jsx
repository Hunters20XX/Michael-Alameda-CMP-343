import Table from './Table'
import Form from './Form'

import {useState} from 'react'

function LinkContainer(){
    const [favLinks, setFavLinks] = useState([])

    const handleRemove = (index) => {
        const newFavLinks = favLinks.filter((_, i) => i !== index);
        setFavLinks(newFavLinks);
    }

    const handleSubmit = (name, URL) => {
        setFavLinks([...favLinks, { name, URL }]);
    }

    return(
        <div>
            <h1>My Favorite Links</h1>
            <p>Add a new URL with a name to the table! </p>
            <Table data={favLinks} removeLink={handleRemove} />
            <h1>Add New</h1>
            <Form submitNewLink={handleSubmit}/>
        </div>
    )
}

export default LinkContainer