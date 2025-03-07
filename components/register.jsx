import React from 'react'
import { useState } from 'react'
import { Register } from '../src/auth.js'


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
        <h1>FIND SOMETHING</h1>
        <img src="https://media.istockphoto.com/id/1266633089/vector/illustration-of-magnifying-glass-with-map-on-lens.jpg?s=612x612&w=0&k=20&c=LHvEwflc9wQ6oJGAtWl4LIb1WBDfNGbeaWdXD1HeHlc=" alt="logo" style={{width: 300, height: 300}}/>
        <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <p style = {{color: "red"}}>{error}</p>
                <label htmlFor="username" style={{marginRight:80}}>Username</label>
                <br/>
                <input type="text" placeholder="Username" value={username} onChange={(input) => setUsername(input.target.value)} required></input>
                <br/>
                <label htmlFor="email" style={{marginRight:110}}>Email</label><br/>
                <input type="email" placeholder="Email" value={email} onChange={(input) => setEmail(input.target.value)} required></input>
                <br/>
                <label htmlFor="username" style={{marginRight:90}}>Password</label><br/>
                <input type="password" placeholder="Password" value={password} onChange={(input) => setPassword(input.target.value)} required></input>
                <br/>
                <button type="submit" style= {{margin:15, backgroundColor: 'gray'}}>Register</button>
                <p onClick={() => setLogin(true)}><a>Already have an account? Login!</a></p>
            </form>
        </>
    )
}
