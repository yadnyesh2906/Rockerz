const audioPlayer = document.getElementById("audioPlayer");
const songList = document.getElementById("songList");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const stopButton = document.getElementById("stopButton");
const voiceCommandButton = document.getElementById("voiceCommandButton");
const commandOutput = document.getElementById("commandOutput");

let recognition;
let isPlaying = false;

// Fetch songs from the server
async function fetchSongs() {
    try {
        const response = await fetch("/api/songs");
        const songs = await response.json();
        displaySongs(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Display the song list
function displaySongs(songs) {
    songList.innerHTML = "";
    songs.forEach((song) => {
        const li = document.createElement("li");
        li.textContent = song;
        li.addEventListener("click", () => playSong(song));
        songList.appendChild(li);
    });
}

// Play a selected song
function playSong(song) {
    audioPlayer.src = `/music/${song}`;
    audioPlayer.play();
    commandOutput.textContent = `Playing: ${song}`;
    isPlaying = true;
}

// Control buttons
playButton.addEventListener("click", () => {
    audioPlayer.play();
    commandOutput.textContent = "Playing music...";
    isPlaying = true;
});

pauseButton.addEventListener("click", () => {
    if (isPlaying) {
        audioPlayer.pause();
        commandOutput.textContent = "Music paused.";
        isPlaying = false;
    }
});

resumeButton.addEventListener("click", () => {
    if (!isPlaying) {
        audioPlayer.play();
        commandOutput.textContent = "Resumed music.";
        isPlaying = true;
    }
});

stopButton.addEventListener("click", () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    commandOutput.textContent = "Music stopped.";
    isPlaying = false;
});

// Voice control
voiceCommandButton.addEventListener("click", () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        alert("Voice recognition is not supported in this browser.");
        return;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();
    commandOutput.textContent = "Listening for commands...";

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        commandOutput.textContent = `Command received: "${command}"`;

        if (command.startsWith("play")) {
            const songName = command.replace("play", "").trim();
            const song = Array.from(songList.children).find((li) =>
                li.textContent.toLowerCase().includes(songName)
            );
            if (song) playSong(song.textContent);
            else commandOutput.textContent = "Song not found.";
        } else if (command === "pause") {
            pauseButton.click();
        } else if (command === "resume") {
            resumeButton.click();
        } else if (command === "stop") {
            stopButton.click();
        } else {
            commandOutput.textContent = "Unknown command.";
        }
    };

    recognition.onerror = (event) => {
        commandOutput.textContent = `Error: ${event.error}`;
    };
});

// Fetch songs on page load
fetchSongs();
