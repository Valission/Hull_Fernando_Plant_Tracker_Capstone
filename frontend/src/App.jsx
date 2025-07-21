import { useEffect } from 'react'
import './App.css'
import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'

import Home from './Home.jsx'
import SignUp from './signUp.jsx'
import LogIn from './Login.jsx'
import Dashboard from './Dashboard.jsx'

function App() {

  const [info, setinfo] = useState([])

  useEffect(() => {

  async function getData() {
    try{
    const response = await fetch('http://localhost:8080/planti')
    const data = await response.json()
    console.log(data)
    }catch(e){
      console.log(e)
      setinfo(info)
    } 
  }

  getData()

}, [])

console.log(info)

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
