// ===== SONG LIST =====
let currentSongIndex = 0;
const songs = [
  { title: "Hana", artist: "Zerobaseone", src: "mp3/hana.mp3", cover: "picture/prezent.png" },
  { title: "Now Or Never", artist: "Zerobaseone", src: "mp3/now-or-never.mp3", cover: "picture/prezent.png" },
  { title: "Only One Story", artist: "Zerobaseone", src: "mp3/only-one-story.mp3", cover: "picture/prezent.png" },
  { title: "Blue", artist: "Zerobaseone", src: "mp3/blue.mp3", cover: "picture/blue-paradise.png" },
  { title: "Devil Game", artist: "Zerobaseone", src: "mp3/devil-game.mp3", cover: "picture/blue-paradise.png" },
  { title: "Out Of Love", artist: "Zerobaseone", src: "mp3/out-of-love.mp3", cover: "picture/blue-paradise.png" },
  { title: "Bad Desire", artist: "Enhypen", src: "mp3/bad-desire.mp3", cover: "picture/desire.png" },
  { title: "Helium", artist: "Enhypen", src: "mp3/helium.mp3", cover: "picture/desire.png" },
  { title: "Into The I Land", artist: "IU", src: "mp3/into-the-iland.mp3", cover: "picture/into-the-iland.png" },
];

// ===== ELEMENTS =====
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const playlistBox = document.getElementById("playlistBox");
const songTitleEl = document.getElementById("songTitle");
const songArtistEl = document.getElementById("songArtist");
const songImgEl = document.getElementById("songImg");
const favBtn = document.getElementById("favBtn");

let isPlaying = false;

// ===== LOAD SONG =====
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  audio.currentTime = 0;
  songTitleEl.innerText = song.title;
  songArtistEl.innerText = song.artist;
  
  // Check if songImgEl exists (for player.html)
  if (songImgEl) {
    songImgEl.innerHTML = `<img src="${song.cover}" alt="${song.title}" />`;
  }
  
  renderPlaylist();
  savePlayerState();
}

// ===== PLAY / PAUSE =====
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playBtn.innerText = "▶";
  } else {
    audio.play().catch(err => console.log("Auto-play blocked:", err));
    playBtn.innerText = "⏸";
  }
  isPlaying = !isPlaying;
  savePlayerState();
}

// ===== NEXT / PREV SONG =====
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play().catch(err => console.log("Auto-play blocked:", err));
  isPlaying = true;
  playBtn.innerText = "⏸";
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play().catch(err => console.log("Auto-play blocked:", err));
  isPlaying = true;
  playBtn.innerText = "⏸";
}

// ===== PLAYLIST RENDER =====
function renderPlaylist() {
  if (!playlistBox) return; // Exit if playlist box doesn't exist
  
  playlistBox.innerHTML = "";
  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.innerText = `${song.title} - ${song.artist}`;
    div.classList.add("playlist-item");
    if (index === currentSongIndex) div.classList.add("active");
    div.onclick = () => {
      currentSongIndex = index;
      loadSong(index);
      audio.play().catch(err => console.log("Auto-play blocked:", err));
      isPlaying = true;
      playBtn.innerText = "⏸";
    };
    playlistBox.appendChild(div);
  });
}

// ===== TOGGLE PLAYLIST =====
function togglePlaylist() {
  if (playlistBox) {
    playlistBox.classList.toggle("show");
  }
}

// ===== SHARE SONG =====
function shareSong() {
  const song = songs[currentSongIndex];
  const shareText = `Check out "${song.title}" by ${song.artist} on QuietHub!`;
  
  if (navigator.share) {
    navigator.share({
      title: song.title,
      text: shareText,
      url: window.location.href
    }).catch(err => console.log("Share failed:", err));
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Song info copied to clipboard!");
    }).catch(err => {
      console.log("Copy failed:", err);
    });
  }
}

// ===== UPDATE PROGRESS BAR =====
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  let minutes = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime % 60);
  if (seconds < 10) seconds = "0" + seconds;
  currentTimeEl.innerText = `${minutes}:${seconds}`;

  let durMinutes = Math.floor(audio.duration / 60);
  let durSeconds = Math.floor(audio.duration % 60);
  if (durSeconds < 10) durSeconds = "0" + durSeconds;
  durationEl.innerText = `${durMinutes}:${durSeconds}`;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// ===== FAVORITE =====
favBtn.addEventListener("click", () => {
  favBtn.classList.toggle("active");
});

// ===== AUTO NEXT SONG (THIS IS KEY!) =====
audio.addEventListener("ended", () => {
  nextSong();
});

// ===== SAVE PLAYER STATE =====
function savePlayerState() {
  const state = {
    currentSongIndex: currentSongIndex,
    isPlaying: isPlaying,
    currentTime: audio.currentTime
  };
  sessionStorage.setItem("playerState", JSON.stringify(state));
}

// ===== RESTORE PLAYER STATE =====
function restorePlayerState() {
  const savedState = sessionStorage.getItem("playerState");
  if (savedState) {
    const state = JSON.parse(savedState);
    currentSongIndex = state.currentSongIndex || 0;
    loadSong(currentSongIndex);
    
    if (state.currentTime) {
      audio.currentTime = state.currentTime;
    }
    
    if (state.isPlaying) {
      audio.play().catch(err => console.log("Auto-play blocked:", err));
      isPlaying = true;
      playBtn.innerText = "⏸";
    }
  } else {
    loadSong(currentSongIndex);
  }
}

// ===== LOAD SONG FROM ARTIST PAGE =====
function loadSongFromArtist(artist, songTitle) {
  const songIndex = songs.findIndex(
    s => s.artist.toLowerCase() === artist.toLowerCase() && 
         s.title.toLowerCase() === songTitle.toLowerCase()
  );
  
  if (songIndex !== -1) {
    currentSongIndex = songIndex;
    loadSong(currentSongIndex);
    audio.play().catch(err => console.log("Auto-play blocked:", err));
    isPlaying = true;
    playBtn.innerText = "⏸";
  } else {
    loadSong(currentSongIndex);
  }
}

// ===== SAVE STATE ON PAGE UNLOAD =====
window.addEventListener("beforeunload", savePlayerState);

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  // Only auto-initialize if not using URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const songParam = urlParams.get("song");
  const artistParam = urlParams.get("artist");
  
  if (!songParam && !artistParam) {
    restorePlayerState();
  }
});