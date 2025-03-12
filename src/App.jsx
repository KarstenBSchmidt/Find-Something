import { useState, useEffect } from 'react'
import './App.css'
import { AuthenticationComponent } from "../components/authentication"
import { LogoutComponent } from "../components/logout"
import Challenge from './components/Challenge'
import Routing from './components/Routing'
import ToggleButton from './components/ToggleButton'
import CompareImage from './components/CompareImage'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import ListChallenges from './components/ListChallenges'

import cameraOn from './assets/cameraOn.png'
import cameraOff from './assets/cameraOff.png'
import bikeOn from './assets/bikeOn.png'
import bikeOff from './assets/bikeOff.png'
import crownOn from './assets/crownOn.png'
import crownOff from './assets/crownOff.png'


function App() {
  const [user, setUser] = useState(null); // Track the user's state
  const [viewChallenge, setViewChallenge] = useState(false); // Track the viewChallenge state
  const [viewImageCompare, setViewImageCompare] = useState(false); // Track the viewImageCompare state
  const [viewPrevious, setViewPrevious] = useState(false); // Track the viewPrevious state
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
        <ToggleButton 
            text="Challenges" 
            enabledImage={bikeOn} 
            disabledImage={bikeOff} 
            onClick={() => setViewChallenge(prev => !prev)} 
        />

        <ToggleButton 
            text="Camera" 
            enabledImage={cameraOn} 
            disabledImage={cameraOff} 
            onClick={() => setViewImageCompare(prev => !prev)} 
        />
      </div>   
    )}
    </header>
    
    

    {!user && (
      <AuthenticationComponent />
    )}
    


    <div className="main-container">
    
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

      {viewPrevious && user && (
        <div className="section">
          <ListChallenges />
        </div>
      )}
    </div>

    <div className="container-row">
        <ToggleButton 
            text="Previous Challenges" 
            enabledImage={crownOn} 
            disabledImage={crownOff} 
            onClick={() => setViewPrevious(prev => !prev)}
        />
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
