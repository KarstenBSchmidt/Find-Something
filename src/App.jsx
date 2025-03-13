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
    <div className="main-container">
    <header>
      <h1 className="page-title">Find Something</h1>

      {!user && (
        <AuthenticationComponent />
      )}
      
   {user && (
      <div className="button-container">
        <ToggleButton 
            text="Challenges" 
            enabledImage={bikeOn} 
            disabledImage={bikeOff} 
            onClick={() => {
              setViewChallenge(prev => !prev)
              setViewImageCompare(false)
              setViewPrevious(false)
            }} 
        />

        <ToggleButton 
            text="Camera" 
            enabledImage={cameraOn} 
            disabledImage={cameraOff} 
            onClick={() => {
              setViewImageCompare(prev => !prev)
              setViewChallenge(false)
              setViewPrevious(false)
            }}
        />
    
      
        <ToggleButton 
          text="Previous Challenges" 
          enabledImage={crownOn} 
          disabledImage={crownOff} 
          onClick={() => {
            setViewPrevious(prev => !prev)
            setViewChallenge(false)
            setViewImageCompare(false)
          }}
        /> 
    </div>
    )}   

    </header>
  

    <div className="main-container">

      {viewChallenge && user && (

          <Challenge />

      )}
     
      
      {viewImageCompare && user && (

          <CompareImage />

      )}  

      {viewPrevious && user && (
        <div className="section">
          <ListChallenges />
        </div>
      )}
    </div>
       
    <div className="logout">
      {user && (
        <LogoutComponent />
      )}  
    </div>

    </div>



     
</>
  )
}

export default App
