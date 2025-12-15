import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Items from './pages/Items'
import AddItem from './pages/AddItem'
import ItemDetail from './pages/ItemDetail'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/new" element={<AddItem />} />
            <Route path="/items/:id" element={<ItemDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
