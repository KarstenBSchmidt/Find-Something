import React, {useState, useEffect} from 'react'
import { getChallenges } from '../firestore';

export default function ListChallenges() {

  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getChallenges()
      .then(data => setChallenges(data))
      .catch(err => setError(err));
  }, []);

  return (
    <>
      <h1>Previous Challenges</h1>
      {error ? (
        <p>Error loading challenges: {error.message}</p>
      ) : (
        <ul>
          {challenges.map((challenge, index) => (
            <li key={index}>
              <p>Longitude: {challenge.longitude}</p>
              <p>Latitude: {challenge.latitude}</p>
              <p>Distance: {challenge.distance}</p>
              <p>Created At: {challenge.createdAt}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
