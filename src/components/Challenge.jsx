import { useEffect, useState } from "react";
import Routing from "./Routing";
import "./Challenge.css";

function Challenge() {
    const [distance, setDistance] = useState(1000); // Default to 1000m
    const [destination, setDestination] = useState(null);
    let startCoords = null;

    const fetchNearestPark = async () => {
        startCoords = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
            (position) => resolve([position.coords.latitude, position.coords.longitude]),
            () => resolve([47.759439, -122.191486])
            );
        });

        const query = `
            [out:json];
            (
                nwr[leisure](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[natural](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[artwork_type](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
            );
            out center;
        `;
        
        try {
            const response = await fetch("https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query));
            const data = await response.json();
            
            if (data.elements.length > 0) {
                const nearest = data.elements[0];
                const lat = nearest.type === "way" || nearest.type === "relation" ? nearest.center.lat : nearest.lat;
                const lon = nearest.type === "way" || nearest.type === "relation" ? nearest.center.lon : nearest.lon;
                setDestination({ lat, lon });
                console.log("Nearest park:", nearest);
            } else {
                alert("No parks found within the selected distance.");
            }
        } catch (error) {
            console.error("Error fetching park data:", error);
        }
    };

    return (
        <div className="challenge-container">
            <h1>Find Something</h1>
            <p>Currently, searches for nearby parks, natural features (EG forests), as well as artwork like statues and sculptures.</p>
            <label htmlFor="distance-slider">Select Distance: {distance} meters</label>
            <input 
                type="range" 
                id="distance-slider" 
                min="100" 
                max="10000" 
                step="100" 
                value={distance} 
                onChange={(e) => setDistance(Number(e.target.value))} 
            />
            <button onClick={fetchNearestPark}>Bring it On!</button>
            {destination && <Routing inputEndLat={destination.lat} inputEndLon={destination.lon} />}
        </div>
    );
}

export default Challenge;
