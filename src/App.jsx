import { useState, useEffect } from 'react'
import './App.css'
import { AuthenticationComponent } from "../components/authentication"
import { LogoutComponent } from "../components/logout"
import Challenge from './components/Challenge'
import Routing from './components/Routing'
import CompareImage from './components/CompareImage'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'


function App() {
  const [user, setUser] = useState(null); // Track the user's state
  const [viewChallenge, setViewChallenge] = useState(false); // Track the viewChallenge state
  const [viewImageCompare, setViewImageCompare] = useState(false); // Track the viewImageCompare state

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

    <header>
      <h1 className="page-title">Find Something</h1>
      {user && (      
      <div className="container-row">
        <button onClick={() => setViewChallenge(!viewChallenge)}>
          {viewChallenge ? "Hide" : "View"} Challenges
        </button>

        <button onClick={() => setViewImageCompare(!viewImageCompare)}>
          {viewImageCompare ? "Hide" : "View"} Image Compare  
        </button>
      </div>   
    )}
    </header>
    
    

    {!user && (
      <AuthenticationComponent />
    )}
    


    <div classname="main-container">
    
    </div>
    
    <div className="container-row">
      {viewChallenge && user && (
        <div className="section">
          <Challenge />
        </div>
      )}
     
      
      {viewImageCompare && user && (
        <div className="section">
          <CompareImage />
        </div>
      )}  
    </div>

    <div className="logout">
      {user && (
        <LogoutComponent />
      )}  
    </div>



     
</>
  )
}

export default App
