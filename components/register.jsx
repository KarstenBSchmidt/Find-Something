import React from 'react'
import { useState } from 'react'
import { Register } from '../src/auth.js'
import '../src/App.css'


export const RegisterComponent = ({ setLogin }) => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleRegister = async (input) => {
        input.preventDefault();
        setError("");

        try {
            await Register(username, email, password);
        } catch (error){
            setError(error.message);
            console.log(error.message);
        }
    }

    return (
        <>
        <img src="https://media.istockphoto.com/id/1266633089/vector/illustration-of-magnifying-glass-with-map-on-lens.jpg?s=612x612&w=0&k=20&c=LHvEwflc9wQ6oJGAtWl4LIb1WBDfNGbeaWdXD1HeHlc=" alt="logo" style={{width: 300, height: 300}}/>

            <div>
            <form onSubmit={handleRegister}>
                <p style = {{color: "red"}}>{error}</p>
                <label htmlFor="username">Username</label>
                <input type="text" placeholder="Username" value={username} onChange={(input) => setUsername(input.target.value)} required></input>
              
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="Email" value={email} onChange={(input) => setEmail(input.target.value)} required></input>
          
                <label htmlFor="username">Password</label>
                <input type="password" placeholder="Password" value={password} onChange={(input) => setPassword(input.target.value)} required></input>
           
                <button className="register-button" type="submit">Register</button>
                <p onClick={() => setLogin(true)}><a>Already have an account? Login!</a></p>
            </form>
            </div>
   
   
    
        </>
    )
}
