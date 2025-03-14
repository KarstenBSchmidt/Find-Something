import React, { useState, useEffect, useRef } from 'react';
import { getChallenges } from '../firestore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ListChallenges.css';

export default function ListChallenges() {
  const [challenges, setChallenges] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // above used to print

  const mapRef = useRef(null);
  const startMarker = useRef(null);
  const [startCoords, setStartCoords] = useState([47.6062, -122.3321]); // Default: Seattle, WA

  // Initialize startCoords once via geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        (position) => setStartCoords([position.coords.latitude, position.coords.longitude]),
        () => setStartCoords([47.759439, -122.191486])
    );
}, []);

  useEffect(() => {
    getChallenges()
      .then((data) => setChallenges(data))
      .catch((err) => setError(err));
  }, []);

  useEffect(() => {
    // setup the map
    if (!mapRef.current) {
      mapRef.current = L.map('challengeMap').setView(startCoords, 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Add start marker
      startMarker.current = L.marker(startCoords)
        .addTo(mapRef.current)
        .bindPopup('Your location')
        .openPopup();
    }

    // Add challenge markers
    challenges.forEach((challenge) => {
      L.marker([challenge.latitude, challenge.longitude])
        .addTo(mapRef.current)
        .bindPopup(`<p>Distance: ${challenge.distance}</p><p>Created At: ${challenge.createdAt}</p>`);
    });

  }, [challenges, startCoords]);

  return (
    <>
        <h2>Your Records</h2>
        <div id="challengeMap"></div>
    </>
  );
}
