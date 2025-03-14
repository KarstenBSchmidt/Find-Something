import { useState, useEffect } from 'react'
import './App.css'
import { AuthenticationComponent } from "../components/authentication"
import { LogoutComponent } from "../components/logout"
import Challenge from './components/Challenge'
import ToggleButton from './components/ToggleButton'
import CompareImage from './components/CompareImage'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import ListChallenges from './components/ListChallenges'
import DrawingChallenge from './components/DrawingChallenge'; 
import cameraOn from './assets/cameraOn.png'
import cameraOff from './assets/cameraOff.png'
import bikeOn from './assets/bikeOn.png'
import bikeOff from './assets/bikeOff.png'
import crownOn from './assets/crownOn.png'
import crownOff from './assets/crownOff.png'


function App() {
    const [user, setUser] = useState(null); // Track the user's state
    const [activeToggle, setActiveToggle] = useState('challenges');
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
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
            </header>

            {user && (
                <div className="container-row">
                    <ToggleButton
                        text="Challenges"
                        enabledImage={bikeOn}
                        disabledImage={bikeOff}
                        isOn={activeToggle === 'challenges'}
                        onClick={() => setActiveToggle('challenges')}
                    />

                    <ToggleButton
                        text="Camera"
                        enabledImage={cameraOn}
                        disabledImage={cameraOff}
                        isOn={activeToggle === 'camera'}
                        onClick={() => setActiveToggle('camera')}
                    />

                    <ToggleButton
                          text="Drawing Challenge"
                          enabledImage={drawingOn}
                          disabledImage={drawingOff}
                          isOn={activeToggle === 'drawing'}
                          onClick={() => setActiveToggle('drawing')}
                    />

                    <ToggleButton
                        text="Records"
                        enabledImage={crownOn}
                        disabledImage={crownOff}
                        isOn={activeToggle === 'records'}
                        onClick={() => setActiveToggle('records')}
                    />
                </div>
            )}

            {!user && <AuthenticationComponent />}

            <div className="main-container"></div>

            <div className="container-row">
                {activeToggle === 'challenges' && user && (
                    <div className="section">
                        <Challenge />
                    </div>
                )}

                {activeToggle === 'camera' && user && (
                    <div className="section">
                        <CompareImage />
                    </div>
                )}

                {activeToggle === 'records' && user && (
                    <div className="section">
                        <ListChallenges />
                    </div>
                )}
            </div>

            <div className="logout">
                {user && <LogoutComponent />}
            </div>
        </>
    )
}

export default App
