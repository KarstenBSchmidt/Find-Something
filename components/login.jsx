import React from 'react'
import { useState } from 'react'
import { Login } from '../src/auth.js'
import '../src/App.css'

export const LoginComponent = ({ setLogin }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (input) => {
        input.preventDefault();
        setError("");

        try {
            await Login(email, password);
        } catch (error){
            setError(error.message);
            console.log(error.message);
        }
    }

    return (
        <>
        <img src="https://media.istockphoto.com/id/1266633089/vector/illustration-of-magnifying-glass-with-map-on-lens.jpg?s=612x612&w=0&k=20&c=LHvEwflc9wQ6oJGAtWl4LIb1WBDfNGbeaWdXD1HeHlc=" alt="logo" style={{width: 300, height: 300}}/>
            <div>
            <form onSubmit={handleLogin}>
                <label style = {{color: "red"}}>{error}</label>

                <label htmlFor="email" style={{marginRight:110}}>Email</label>
                <input type="email" placeholder="Email" value={email} onChange={(input) => setEmail(input.target.value)} required></input>

                <label htmlFor="username" style={{marginRight:90}}>Password</label>
                <input type="password" placeholder="Password" value={password} onChange={(input) => setPassword(input.target.value)} required></input>
                
                <button className="register-button" type="submit">Login</button>
                <p onClick={() => setLogin(false)}><a>Don't have an account? 
                    <span className="register-link"> Make one!</span></a></p>
            </form>
            </div>
        </>
    )
}
