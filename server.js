const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const HOSTNAME = "localhost"; // Replace with your custom hostname if needed (e.g., "rockerz.local")

// Folder containing music files
const musicFolder = path.join(__dirname, "music");

// Serve static files (e.g., music files)
app.use("/music", express.static(musicFolder));

// Endpoint to fetch the list of songs
app.get("/api/songs", (req, res) => {
    fs.readdir(musicFolder, (err, files) => {
        if (err) {
            console.error("Error reading music folder:", err.message);
            return res.status(500).json({ error: "Failed to read music folder." });
        }

        // Filter only valid audio files
        const songs = files.filter((file) => /\.(mp3|wav|ogg)$/.test(file));
        if (songs.length === 0) {
            return res.status(404).json({ message: "No songs available in the music folder." });
        }

        res.json(songs);
    });
});

// Default route to display a friendly message
app.get("/", (req, res) => {
    res.send(`
        <h1>🎵 Welcome to the Rockerz Music Control System 🎵</h1>
        <p>Use <a href="/api/songs">/api/songs</a> to fetch the list of available songs.</p>
    `);
});

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).send("404 Not Found - The requested resource does not exist.");
});

// Start the server
app.listen(PORT, HOSTNAME, () => {
    console.log(`🎶 Server is running at http://${HOSTNAME}:${PORT}`);
    console.log(`🎧 Visit http://${HOSTNAME}:${PORT}/api/songs to view available songs.`);
});
