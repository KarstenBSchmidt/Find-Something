import { useState, useEffect } from "react";
import Routing from "./Routing";
import "./Challenge.css";
import loadingIcon from "../assets/loadingIcon.gif";

function Challenge() {
    const [distance, setDistance] = useState(1000); // Default to 1000m
    const [places, setPlaces] = useState([]); // Store all fetched places from the Overpass API
    const [currentIndex, setCurrentIndex] = useState(0); // Track the index of the currently selected place
    const [destination, setDestination] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    let startCoords = null;

    const fetchNearestPlace = async () => {
        // Get the user's current location or default to UW Bothell main plaza
        // We have to wait for this before we can get the nearest places, because otherwise we won't know where to start from.
        startCoords = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
            (position) => resolve([position.coords.latitude, position.coords.longitude]),
            () => resolve([47.759439, -122.191486])
            );
        });

        const searchDistance = distance * 0.75;

        // We can add whatever we want to this query. 
        // Use the OpenStreetMap Wiki to see what's there: https://wiki.openstreetmap.org/.
        const query = `
            [out:json];
            (
                nwr[artwork_type](around:${searchDistance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[tourism=artwork](around:${searchDistance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[waterway=waterfall](around:${searchDistance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[amenity=fountain](around:${searchDistance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[bridge=boardwalk](around:${searchDistance}, ${startCoords[0]}, ${startCoords[1]});
                nwr[tourism=viewpoint](around:${searchDistance}, ${startCoords[0]}, ${startCoords[1]}); 
                nwr[leisure=park](around:${searchDistance}, ${startCoords[0]}, ${startCoords[1]});               
            );
            out center;
        `;

        // If we can't find anything interesting, we can also just query for every piece of data in the radius. 
        // This is practically guaranteed to get something, but it's most often a single node in a road or something.
        const generousQuery = `
            [out:json];
            (
                nwr(around:${searchDistance}, ${startCoords[0]}, ${startCoords[1]});
            );
            out center;
        `;
        
        try {
            setIsSearching(true);
            let response = await fetch("https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query.trim()));
            let data = await response.json();
            setIsSearching(false);

            // If we can't find anything interesting, try a more generous query
            if (data.elements.length === 0) {
                console.log("No results found, trying a more generous query...");
                setIsSearching(true);
                response = await fetch("https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(generousQuery));
                data = await response.json();
                setIsSearching(false);

                // If that still doesn't work, give up
                if (data.elements.length === 0) {
                    console.error("No results found.");
                    return;
                }
            }

            // Order data.elements by closest to farthest using `distance` meters from startCoords
            // An element that is 5km away from startcoords with input distance of 10km will be sorted before an element that is 6km away
            //! Note that this is not walking distance, but straight-line distance
            // TODO: If we have time, we can calculate the actual walking distance using the GraphHopper API
            // ^ This is costly, so we might not want to implement that at all either
            data.elements.sort((a, b) => {
                const getCoords = (element) => {
                    if (element.lat !== undefined && element.lon !== undefined) {
                        return [element.lat, element.lon]; // For nodes
                    } else if (element.center) {
                        return [element.center.lat, element.center.lon]; // For ways and relations
                    }
                    return [NaN, NaN]; // Default to NaN if no coordinates exist
                };

                const [aLat, aLon] = getCoords(a);
                const [bLat, bLon] = getCoords(b);

                const aDist = Math.hypot(aLat - startCoords[0], aLon - startCoords[1]);
                const bDist = Math.hypot(bLat - startCoords[0], bLon - startCoords[1]);

                // Calculate how close each element is to the user's desired distance
                const aCloseness = Math.abs(aDist - distance);
                const bCloseness = Math.abs(bDist - distance);

                // Sort by closeness to desired distance
                return aCloseness - bCloseness;
            });
            
            // Get the element that is the closest to the desired distance
            const nearest = data.elements[0];

            // Get the name of the place using the name, tourism, natural, or historic tag
            // If it doesn't have any of those tags, use "Destination"
            const name = getName(nearest);

            // Set the destination for routing, then log
            // Store all found places and reset index to 0
            setPlaces(data.elements);
            setCurrentIndex(0);
            updateDestination(data.elements[0]); // Set the first place as the initial destination
            console.log("Nearest place:", name, nearest);
        } catch (error) {
            console.error("Error fetching place data:", error);
        }
    };

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const getFirstTagValue = (tags) => {
        if (!tags || Object.keys(tags).length === 0) return null; // Ensure tags exist and are not empty
        return tags[Object.keys(tags)[0]]; // Get the value of the first key
    };
    const getName = (place) => {
        if (place.tags?.name) {
            return capitalizeFirstLetter(place.tags.name);
        }
        else {
            return "Unnamed " + capitalizeFirstLetter(
                place.tags?.tourism || 
                place.tags?.natural || 
                place.tags?.historic || 
                getFirstTagValue(place.tags) ||
                "Destination"
            );
        }
    };

    // Function to update the current destination based on a selected place
    const updateDestination = (place) => {
        if (!place) return;

        // Determine latitude and longitude, using center coordinates for ways/relations
        const lat = place.type === "way" || place.type === "relation" ? place.center.lat : place.lat;
        const lon = place.type === "way" || place.type === "relation" ? place.center.lon : place.lon;
        
        // Try predefined keys first, then fall back to the first tag's value
        const name = getName(place);

        // Update the state with the new destination
        setDestination({ lat, lon, name });
    };

    // Function to move to the next available place in the list
    const handleReRoll = () => {
        if (places.length === 0) return; // Ensure there are places available
        const newIndex = (currentIndex + 1) % places.length; // Loop through places cyclically
        setCurrentIndex(newIndex);
        updateDestination(places[newIndex]); // Update destination with the new place
    };

    // useEffect, set destination to null island
    useEffect(() => {
        setDestination({ lat: 0, lon: 0, name: "Null Island" });
        places.push("Nothing");
    }, []);

    return (
        <div className="challenge-container">
            <div id="inputContainer">
                <div id="sliderWithCaption">
                    <label htmlFor="distance-slider">
                        <span>
                            {distance}m
                            {isSearching && (<img src={loadingIcon} style={{width:12, height:12, marginRight: 0, marginBottom: 0, marginTop: 0}}></img>)}
                        </span>
                    </label>
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
                
                <button onClick={fetchNearestPlace}>Search</button>
                {places.length > 1 && <button onClick={handleReRoll} >Next</button>}
            </div>
            
            {/* added this so the routing comopnent is only rendered once a place is found */}
            {places.length > 0 && (
            <div id="routingContainer">
                <Routing inputEndLat={destination.lat} inputEndLon={destination.lon} destinationName={destination.name} />
            </div>
            )}
        </div>
    );
}

export default Challenge;