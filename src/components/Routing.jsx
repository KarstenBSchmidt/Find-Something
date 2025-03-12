import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Routing.css";
import { storeChallenge } from "../firestore";

const transportationMode = "foot";
// For now, this is just a string (and it's my own personal key so don't get any funny ideas!). 
// TODO: If we have time, we should move this to a .env file.
const graphHopperApiKey = "fd70d72c-e0ae-476c-8001-c769b2269239";

function Routing({ inputEndLat, inputEndLon, destinationName }) {
    // Uncomment the following line to see the destination coordinates in the console
    // These are live updates rather than "we're actually going now!"
    // console.log("Routing to " + inputEndLat + ", " + inputEndLon);

    // useRef(null) is a common pattern for storing mutable values that don't trigger re-renders
    // So even though stuff like the dstMarker.current value changes, the component won't re-render
    const [startCoords, setStartCoords] = useState(null);
    const mapRef = useRef(null);
    const routeLayerRef = useRef(null);
    const dstMarker = useRef(null);
    const startMarker = useRef(null);

    // Initialize startCoords once via geolocation
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => setStartCoords([position.coords.latitude, position.coords.longitude]),
            () => setStartCoords([47.759439, -122.191486])
        );
    }, []);

    // Initialize the map only once when startCoords is available
    useEffect(() => {
        if (startCoords && !mapRef.current) {
            mapRef.current = L.map("map").setView(startCoords, 14);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(mapRef.current);

            // Add start marker after the map is initialized
            startMarker.current = L.marker(startCoords).addTo(mapRef.current);
            startMarker.current.bindPopup("Your location");

            // function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
            //     var R = 6378.137; // Radius of earth in KM
            //     var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
            //     var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
            //     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            //     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            //     Math.sin(dLon/2) * Math.sin(dLon/2);
            //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            //     var d = R * c;
            //     return d;
            // }
            // const distance = measure(startCoords[0], startCoords[1], inputEndLat, inputEndLon) / 7;
            // L.circle(startCoords, { radius: distance }).addTo(mapRef.current);
        }
    }, [startCoords]);

    // Draw or update the route whenever destination changes
    useEffect(() => {
        if (!startCoords || !inputEndLat || !inputEndLon || !mapRef.current) return;

        // Remove previous route layer if it exists
        if (routeLayerRef.current) {
            mapRef.current.removeLayer(routeLayerRef.current);
        }

        // Fetch new route data
        // Uncomment the following line to see the destination coordinates in the console once we've actually started routing
        // console.log("Actually routing to " + inputEndLat + ", " + inputEndLon);
        fetch(`https://graphhopper.com/api/1/route?point=${startCoords[0]},${startCoords[1]}&point=${inputEndLat},${inputEndLon}&vehicle=${transportationMode}&locale=en&key=${graphHopperApiKey}&points_encoded=false`)
            .then(response => response.json())
            .then(routeData => {
                if (!routeData.paths || routeData.paths.length === 0) {
                    console.error("No route found.");
                    return;
                }

                // Draw the route using the returned coordinates
                const routeCoords = routeData.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]);
                routeLayerRef.current = L.polyline(routeCoords, { color: "blue", weight: 5, opacity: 0.4 }).addTo(mapRef.current);

                // Mark the destination on the map
                if (dstMarker.current) {
                    mapRef.current.removeLayer(dstMarker.current);
                }

                // TODO: If we have time, make a custom marker for the destination
                // const dstIcon = L.icon({
                //     iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
                //     iconSize: [32, 32],
                //     iconAnchor: [16, 32],
                // });
                // dstMarker.current = L.marker([inputEndLat, inputEndLon], { icon: dstIcon }).addTo(mapRef.current);
                dstMarker.current = L.marker([inputEndLat, inputEndLon]).addTo(mapRef.current);
                // Add a popup to the marker
                const distance = (routeData.paths[0].distance / 1000).toFixed(2);
                dstMarker.current.bindPopup(destinationName + "\n" + distance + "km.").openPopup();

                // Add challenge to firestore
                storeChallenge(inputEndLon, inputEndLat, distance);
            })
            .catch(error => console.error("Error fetching route:", error));
    }, [startCoords, inputEndLat, inputEndLon]);

    // All Routing does is create and display a map. 
    // TODO: I'm not super happy with the dimensions of the map, but at the same time I really can't figure out how to fix it.
    return <div id="map" />;
}

export default Routing;
