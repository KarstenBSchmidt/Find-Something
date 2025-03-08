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
                nwr[artwork_type](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[waterway=waterfall](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[man_made=flagpole](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[amenity=fountain](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[station](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[highway=pedestrian](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[bridge=boardwalk](around:${distance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[tourism=artwork](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[tourism=viewpoint](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[natural=cave_entrance](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[natural=cliff](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[natural=volcano](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[natural=spring](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[historic=ruins](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[historic=castle](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[historic=monument](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[historic=archaeological_site](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[historic=memorial](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[building=yes][architect](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[man_made=clock](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[man_made=windmill](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[man_made=lighthouse](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[man_made=tower](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[tunnel=yes](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[natural=beach](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[man_made=treehouse](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[natural=geyser](around:${distance}, ${startCoords[0]}, ${startCoords[1]}); 
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
            <p>Find parks, forests, artwork, and more.</p>
            <div id="inputContainer">
                <div id="sliderWithCaption">
                    <label htmlFor="distance-slider">{distance} meters</label>
                    <input 
                        type="range" 
                        id="distance-slider" 
                        min="100" 
                        max="10000" 
                        step="100" 
                        value={distance} 
                        onChange={(e) => setDistance(Number(e.target.value))} 
                    />
                </div>
                
                <button onClick={fetchNearestPark}>Bring it On!</button>
            </div>
            
            <div id="routingContainer">
                {destination && <Routing inputEndLat={destination.lat} inputEndLon={destination.lon} />}
            </div>
            
        </div>
    );
}

export default Challenge;
