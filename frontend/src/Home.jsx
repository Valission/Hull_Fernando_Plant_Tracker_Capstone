import { useState, useEffect } from "react";

const plantImages = [
    '/public/pexels-adrian-mohammad-487852-1224158.jpg',
    '/public/pexels-lynda-sanchez-825238-1777813.jpg',
    '/public/pexels-nietjuhart-1445416.jpg',
    '/public/pexels-scottwebb-1022922.jpg',
    '/public/pexels-scottwebb-1048035.jpg'
]

function Home(){
    const[currentImage, setCurrentImage] = useState(0)

    useEffect(() => {
        //sets a reoccurring timer to function every 3 seconds
        const interval = setInterval(() =>{
            setCurrentImage((prevIndex) => (prevIndex + 1) % plantImages.length)
        }, 3000)
        return() => clearInterval(interval)
    },[])

    return(
        <div className="home-container">
            <div className="web-name">
                <h1>Plant Tracker</h1>
            </div>
            <img
            src={plantImages[currentImage]}
            alt="Plant slideshow"
            className="slideshow-image"/>
            <div className="home-message">
                <h2>Want to track your plant</h2>
            </div>
            <div className="btn-container">
                <button className="Sign-up">Sign Up</button>
                <button className="Log-in">Log In</button>
            </div>
        </div>
    )
}
export default Home