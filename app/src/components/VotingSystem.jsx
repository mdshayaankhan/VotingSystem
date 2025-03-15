import React, { useState, useEffect } from "react";
import axios from "axios";
import '../components/VotingSystem.css';

const VotingSystem = () => {
    const [parties, setParties] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);
    const [message, setMessage] = useState("");

    
   const partyImages = {
    "Bharat Rashtra Samithi": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bharat_Rashtra_Samithi_symbol.png",
    "Indian National Congress": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Indian_National_Congress_hand_logo.png",
    "Aam Aadmi Party": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Aam_Aadmi_Party_Election_Symbol.png",
    "Telugu Desam Party": "https://upload.wikimedia.org/wikipedia/commons/9/92/Telugu_Desam_Party_flag.png",
    "Dravida Munnetra Kazhagam": "https://upload.wikimedia.org/wikipedia/commons/d/d1/DMK_Symbol_Rising_Sun.png"
};

    
    useEffect(() => {
        axios.get("http://localhost:5000/parties")
            .then(response => {
                const updatedParties = response.data.map(party => ({
                    ...party,
                    symbol: partyImages[party.partyName] || "https://via.placeholder.com/100"
                }));
                setParties(updatedParties);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);


    const vote = (partyId) => {
        if (hasVoted) return;

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
        <div className="container">
            <h1>Vote for Your Favorite Party</h1>
            {message && <p className="message">{message}</p>}
            <ul className="party-list">
                {parties.map(party => (
                    <li key={party.id} className="party-card">
                        <img src={party.symbol} alt={party.partyName} className="party-symbol" />
                        <div className="party-info">
                            <h3>{party.partyName}</h3>
                            {/* <p>Votes: {party.votes || 0}</p> */}
                            <button 
                                onClick={() => vote(party.id)}
                                disabled={hasVoted}
                                className="vote-button"
                            >
                                {hasVoted ? "Voted" : "Vote"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VotingSystem;
