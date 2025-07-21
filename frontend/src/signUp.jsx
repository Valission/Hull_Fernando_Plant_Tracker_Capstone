import React from "react";
import './signUp.css'

function SignUp() {
    return(
        <div className="signup-container">
            <h2>Create Your Account</h2>
            <form className="signup-form">
                <div>
                    <input type="text" name="username" placeholder="Username" required />
                </div>
                <div>
                    <input type="password" name="password" placeholder="Password" required />
                </div>
                <button type="submit">Sign Up</button>
                <p>already have an account? <a href="">Log in</a></p>
            </form>

        </div>
    )
}

export default SignUp