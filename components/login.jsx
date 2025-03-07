import React from 'react'
import { useState } from 'react'
import { Login } from '../src/auth.js'

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
        <h1>FIND SOMETHING</h1>
        <img src="https://media.istockphoto.com/id/1266633089/vector/illustration-of-magnifying-glass-with-map-on-lens.jpg?s=612x612&w=0&k=20&c=LHvEwflc9wQ6oJGAtWl4LIb1WBDfNGbeaWdXD1HeHlc=" alt="logo" style={{width: 300, height: 300}}/>
        <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <p style = {{color: "red"}}>{error}</p>
                <label htmlFor="email" style={{marginRight:110}}>Email</label><br/>
                <input type="email" placeholder="Email" value={email} onChange={(input) => setEmail(input.target.value)} required></input>
                <br/>
                <label htmlFor="username" style={{marginRight:90}}>Password</label><br/>
                <input type="password" placeholder="Password" value={password} onChange={(input) => setPassword(input.target.value)} required></input>
                <br/>
                <button type="submit" style= {{margin:15, backgroundColor: 'gray'}}>Login</button>
                <p onClick={() => setLogin(false)}><a>Don't have an account? Make one!</a></p>
            </form>
        </>
    )
}
