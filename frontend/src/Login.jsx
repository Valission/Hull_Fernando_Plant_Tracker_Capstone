import React, {useState} from "react";
import { useNavigate,Link} from "react-router-dom";
import './login.css'


function LogIn(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            })

            const data = await response.json()

            if(response.ok){
                localStorage.setItem('token', data.token)
                setMessage('Login succesfull')
            }
            else{
                setMessage(data.message || 'Login failed')
            }
        }
        catch (err) {
            console.error(err)
            setMessage('Something went wrong. Try again later.')
        }
    }
    
    return(
        <div className="login-container">
            <h2>Login to Your Account</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div>
                    <input 
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <button type="submit">Log in</button>
                {message && <p>{message}</p>}
                <p>Don't have an account <Link to= "/signup">Sign Up</Link></p>
            </form>
        </div>
    )
}

export default LogIn