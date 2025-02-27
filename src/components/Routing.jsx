import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './Routing.css'

function Routing({ inputStartLat, inputStartLon, inputEndLat, inputEndLon} ) {
    let inputStartCoords = [inputStartLat, inputStartLon];
    let inputEndCoords = [inputEndLat, inputEndLon];
    if (!inputStartCoords || !inputEndCoords) {
        inputStartCoords = [47.759439, -122.191486]; // Default to UW Bothell
        inputEndCoords = [47.656667, -122.351096]; // Default to UW Seattle
    }


    useEffect(() => {
        const mapStart = [47.759439, -122.191486]; // Centered on UW Bothell
        const map = L.map("map").setView(mapStart, 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        L.polyline([inputStartCoords, inputEndCoords], { color: "blue" }).addTo(map);

        return () => map.remove(); // Cleanup to avoid duplicate maps
    }, []); // Run only once when the component mounts

    return <div id="map"/>;
}

export default Routing;
