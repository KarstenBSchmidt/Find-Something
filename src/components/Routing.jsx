import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Routing.css";

const transportationMode = "foot";
const graphHopperApiKey = "fd70d72c-e0ae-476c-8001-c769b2269239";

function Routing({ inputEndLat, inputEndLon }) {
    console.log("Routing to " + inputEndLat + ", " + inputEndLon);
    const [startCoords, setStartCoords] = useState(null);
    const mapRef = useRef(null);
    const routeLayerRef = useRef(null);

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
            mapRef.current = L.map("map").setView(startCoords, 16);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(mapRef.current);
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
        console.log("Actually routing to " + inputEndLat + ", " + inputEndLon);
        fetch(`https://graphhopper.com/api/1/route?point=${startCoords[0]},${startCoords[1]}&point=${inputEndLat},${inputEndLon}&vehicle=${transportationMode}&locale=en&key=${graphHopperApiKey}&points_encoded=false`)
            .then(response => response.json())
            .then(routeData => {
                if (!routeData.paths || routeData.paths.length === 0) {
                    console.error("No route found.");
                    return;
                }

                // Draw the route using the returned coordinates
                const routeCoords = routeData.paths[0].points.coordinates.map(coord => [coord[1], coord[0]]);
                routeLayerRef.current = L.polyline(routeCoords, { color: "blue", weight: 5 }).addTo(mapRef.current);

                // Mark the destination on the map
                L.marker([inputEndLat, inputEndLon]).addTo(mapRef.current);
            })
            .catch(error => console.error("Error fetching route:", error));
    }, [startCoords, inputEndLat, inputEndLon]);

    return <div id="map" />;
}

export default Routing;
