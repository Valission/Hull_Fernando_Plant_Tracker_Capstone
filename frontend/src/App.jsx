import { useEffect } from 'react'
import './App.css'
import { useState } from 'react'

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
      Hello (from frontend)
    </>
  )
}

export default App
