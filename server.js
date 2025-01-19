const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Heroku will assign a port for production, else defaults to 3000
const HOSTNAME = "localhost"; // Custom hostname (e.g., "rockerz.local")

// Folder containing music files
const musicFolder = path.join(__dirname, "music");

// Serve static files (e.g., music)
app.use("/music", express.static(musicFolder));

// Endpoint to fetch the list of songs
app.get("/api/songs", (req, res) => {
    fs.readdir(musicFolder, (err, files) => {
        if (err) {
            console.error("Error reading music folder:", err.message);
            return res.status(500).json({ error: "Failed to read music folder." });
        }

        const songs = files.filter((file) => /\.(mp3|wav|ogg)$/.test(file));
        if (songs.length === 0) {
            return res.status(404).json({ message: "No songs available in the music folder." });
        }

        res.json(songs);
    });
});

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to the Rockerz Music Control System!");
});

// Start the server
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
});
