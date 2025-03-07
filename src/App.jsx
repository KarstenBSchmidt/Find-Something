import { useState, useEffect } from 'react'
import './App.css'
import { AuthenticationComponent } from "../components/authentication"
import { LogoutComponent } from "../components/logout"
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'


function App() {
  const [user, setUser] = useState(null); // Track the user's state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
    { !user ? (
      <AuthenticationComponent />
    ) : (
      // This would be a logged in user (show whatever we need here...) Just include the login component in it / where we want it.
      <LogoutComponent />
    )

    }
     
    </>
  )
}

export default App
