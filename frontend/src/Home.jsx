import { useState, useEffect } from "react";
import './Home.css'

const plantImages = [
    '/public/pexels-adrian-mohammad-487852-1224158.jpg',
    '/public/pexels-lynda-sanchez-825238-1777813.jpg',
    '/public/pexels-nietjuhart-1445416.jpg',
    '/public/pexels-scottwebb-1022922.jpg',
    '/public/pexels-scottwebb-1048035.jpg'
]

function Home(){
    const [currentImage, setCurrentImage] = useState(0)
    const [prevImage, setPrevImage] = useState(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setPrevImage(currentImage)           // Save current image to prevImage before changing
            setCurrentImage((prevIndex) => (prevIndex + 1) % plantImages.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [currentImage])  // Depend on currentImage so prevImage updates correctly

    useEffect(() => {
        if (prevImage !== null) {
            const timeout = setTimeout(() => setPrevImage(null), 1000) // Clear prevImage after 1s
            return () => clearTimeout(timeout)
        }
    }, [prevImage])

    return (
        <div className="home-container">
            <div className="web-name">
                <h1>Plant Tracker</h1>
            </div>

            <div className="slideshow-wrapper">
                {prevImage !== null && (
                    <img
                        key={`prev-${prevImage}`}
                        src={plantImages[prevImage]}
                        className="slideshow-img exit-left"
                        alt="previous"
                    />
                )}

                <img
                    key={`current-${currentImage}`}
                    src={plantImages[currentImage]}
                    className="slideshow-img enter-right"
                    alt="current"
                />
            </div>

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

export default Home;
