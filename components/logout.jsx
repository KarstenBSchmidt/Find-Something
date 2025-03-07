import React from 'react'
import '../src/App.css'
import { Logout } from '../src/auth.js'

export const LogoutComponent = () => {

      const handleLogout = async () => {
        try {
            await Logout();
        } catch (error){
            console.log(error.message);
        }
    }

    return (
        <>
        <button onClick={handleLogout}>Logout</button>
        </>
    )
}
