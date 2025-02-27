import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Routing from './components/Routing.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Routing inputStartLat="47.759439" inputStartLon="-122.191486" inputEndLat="47.656667" inputEndLon="-122.351096"/>
  </StrictMode>,
)
