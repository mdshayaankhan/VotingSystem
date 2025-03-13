const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "votingsystem"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});

app.get("/parties", (req, res) => {
    db.query("SELECT * FROM parties", (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        res.json(result);
    });
});


app.post("/vote/:id", (req, res) => {
    const partyId = req.params.id;

    
    db.query("INSERT INTO results (party_id) VALUES (?)", [partyId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        
        db.query("UPDATE parties SET votes = votes + 1 WHERE id = ?", [partyId], (err, updateResult) => {
            if (err) return res.status(500).json({ message: "Error updating vote" });

            res.json({ message: "Successfully voted!" });
        });
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
