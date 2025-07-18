import React from "react";

function SignUp() {
    return(
        <div className="signup-container">
            <h2>Create Your Account</h2>
            <form className="signup-form">
                <div>
                    <input type="text" placeholder="Username" required />
                </div>
                <div>
                    <input type="text" placeholder="Password" required />
                </div>
                <button type="submit">Sign Up</button>
            </form>

        </div>
    )
}

export default SignUp