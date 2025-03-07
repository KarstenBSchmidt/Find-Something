import React from 'react'
import { useState } from 'react'
import { RegisterComponent } from "../components/register"
import { LoginComponent } from "../components/login"

export const AuthenticationComponent = () => {
  const [login, setLogin] = useState(false);

  // Start on the register page, then go to login if they already have an account.
return (
  <>
    {!login ? (
    <RegisterComponent setLogin={setLogin}/>
    ) : (
    <LoginComponent setLogin={setLogin}/>
    )}
  </>
)
}