import React, { useState, useEffect } from "react";
import axios from "axios";
import '../components/VotingSystem.css'
const VotingSystem = () => {
    const [parties, setParties] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch parties data
    useEffect(() => {
        axios.get("http://localhost:5000/parties")
            .then(response => setParties(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    // Vote function
    const vote = (partyId) => {
        if (hasVoted) return; // Prevent multiple votes

        axios.post(`http://localhost:5000/vote/${partyId}`)
            .then(response => {
                setHasVoted(true);
                setMessage(response.data.message);
                setParties(prevParties => prevParties.map(p => 
                    p.id === partyId ? { ...p, votes: (p.votes || 0) + 1 } : p
                ));
            })
            .catch(error => {
                setMessage(error.response?.data?.message || "Error voting");
            });
    };

    return (
        <div>
            <h1>Vote for Your Favorite Party</h1>
            {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
            <ul>
                {parties.map(party => (
                    <li key={party.id} style={{ marginBottom: "10px" }}>
                        {party.partyName} - Votes: {party.votes || 0} 
                        <button 
                            onClick={() => vote(party.id)}
                            disabled={hasVoted}
                            style={{
                                marginLeft: "10px",
                                padding: "5px 10px",
                                backgroundColor: hasVoted ? "gray" : "blue",
                                color: "white",
                                cursor: hasVoted ? "not-allowed" : "pointer"
                            }}
                        >
                            {hasVoted ? "Voted" : "Vote"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VotingSystem;
