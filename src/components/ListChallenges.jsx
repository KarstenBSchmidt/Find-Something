import React, {useState} from 'react'
import { getChallenges } from '../firestore';

export default function ListChallenges() {
    
  return (
    <>
    <h1>Previous Challenges</h1>
    <ul>
        {/*(getChallenges()).map((challenge, index) => (
            <li key={index}>
                <p>Longitude: {challenge.longitude}</p>
                <p>Latitude: {challenge.latitude}</p>
                <p>Distance: {challenge.distance}</p>
                <p>Created At: {challenge.createdAt}</p>
            </li>
        ))*/}
    </ul>
    </>
    
  )
}
