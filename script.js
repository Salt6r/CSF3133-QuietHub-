// ===== SONG LIST ===== 
let currentSongIndex = 0;
const songs = [
  { title: "Hana", artist: "Zerobaseone", src: "mp3/hana.mp3", cover: "picture/prezent.png" },
  { title: "Now Or Never", artist: "Zerobaseone", src: "mp3/now-or-never.mp3", cover: "picture/prezent.png" },
  { title: "Only One Story", artist: "Zerobaseone", src: "mp3/only-one-story.mp3", cover: "picture/prezent.png" },
  { title: "Bad Desire", artist: "Enhypen", src: "mp3/bad-desire.mp3", cover: "picture/desire.png" },
  { title: "Helium", artist: "Enhypen", src: "mp3/helium.mp3", cover: "picture/desire.png" },
  { title: "Into The I Land", artist: "IU", src: "mp3/into-the-iland.mp3", cover: "picture/into-the-iland.png" },
];

// ===== LYRICS DATA (Fallback) =====
const lrcLyricsData = {
  "Zerobaseone-Hana": [
    { time: 0.0, text: "" },
    { time: 15.0, text: "この手で大きな花咲かせられると" },
    { time: 19.0, text: "Oh 思っていたんだ" },
    { time: 23.0, text: "果てない水平線" },
    { time: 27.5, text: "越えて出会えたのは" },
    { time: 32.0, text: "Whoa 君の微笑み" },
    { time: 36.5, text: "Oh 君を思うたび毎回" },
    { time: 41.0, text: "辛いときもまた fly high" },
    { time: 45.5, text: "どこまででも続くのは" },
    { time: 50.0, text: "1つの花びらも" },
    { time: 54.0, text: "1つに集まれば" },
    { time: 58.0, text: "大きな hana になるんだ" },
    { time: 62.5, text: "今咲かせよう" },
    { time: 67.0, text: "色とりどりの花びらが" },
    { time: 71.5, text: "同じ夢追いかけて" },
    { time: 76.0, text: "咲かせた hana" },
    { time: 80.0, text: "輝くんだ" },
    { time: 84.5, text: "季節が移るように" },
    { time: 89.0, text: "僕ら離れても感じるよ" },
    { time: 93.5, text: "応援の光が差し込むよ oh" },
    { time: 98.0, text: "ずっと開けその扉を" },
    { time: 102.5, text: "どこでもね覚えているから" },
    { time: 107.0, text: "Hana になるよ" },
    { time: 111.5, text: "Oh 君を思うたび毎回" },
    { time: 116.0, text: "辛いときもまた fly high" },
    { time: 120.5, text: "どこまででも続くのは" },
    { time: 125.0, text: "1つの花びらも" },
    { time: 129.0, text: "1つに集まれば" },
    { time: 133.0, text: "大きな hana になるんだ" },
    { time: 137.5, text: "今咲かせよう" },
    { time: 142.0, text: "色とりどりの花びらが" },
    { time: 146.5, text: "同じ夢追いかけて" },
    { time: 151.0, text: "咲かせた hana" },
    { time: 155.0, text: "輝くんだ" }
  ],
  // ... tambah semua lagu lain ikut format sama
};

// ===== RELATED ARTISTS =====
const relatedArtists = [
  { name: "IU", img: "picture/into-the-iland.png", link: "playlist.html?artist=IU" },
  { name: "Enhypen", img: "picture/desire.png", link: "playlist.html?artist=Enhypen" },
  { name: "Zerobaseone", img: "picture/prezent.png", link: "playlist.html?artist=Zerobaseone" }
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
const albumCoverEl = document.querySelector(".player-section-album-cover img");
const favBtn = document.getElementById("favBtn");
let isPlaying = false;
let lrcLyrics = [];
let lastHighlightedIndex = -1;

// ===== LOAD SONG =====
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  audio.currentTime = 0;
  songTitleEl.innerText = song.title;
  songArtistEl.innerText = song.artist;
  updateLyrics(song.title, song.artist);
  updateRelatedArtists(song.artist);

  if (albumCoverEl) albumCoverEl.src = song.cover;
  if (songImgEl) songImgEl.innerHTML = `<img src="${song.cover}" alt="${song.title}" />`;

  renderPlaylist();
  savePlayerState();
}

// ===== UPDATE LYRICS =====
function updateLyrics(song, artist) {
  const lyricsBox = document.getElementById("lyrics");
  if (!lyricsBox) return;

  const key = `${artist}-${song}`;
  lyricsBox.innerHTML = `<h4>Lyrics</h4><div id="lyricsLines"></div>`;
  const lyricsLines = document.getElementById("lyricsLines");

  lastHighlightedIndex = -1; // reset highlight

  // Try LRC first
  loadLrcLyrics(song, artist);

  // fallback
  if (!lrcLyrics.length && lrcLyricsData[key]) {
    lrcLyrics = lrcLyricsData[key]; // penting assign ke lrcLyrics
    lrcLyrics.forEach(line => {
      const p = document.createElement("p");
      p.innerText = line.text;
      lyricsLines.appendChild(p);
    });
  } else if (!lrcLyrics.length) {
    lyricsLines.innerHTML = `<p>Lyrics not available.</p>`;
  }
}

// ===== LRC SYSTEM =====
function loadLrcLyrics(song, artist) {
  const fileName = `lyrics/${artist}-${song}.lrc`;
  fetch(fileName)
    .then(res => res.text())
    .then(text => {
      lrcLyrics = parseLRC(text);
      const lyricsLines = document.getElementById("lyricsLines");
      lyricsLines.innerHTML = "";
      lrcLyrics.forEach(line => {
        const p = document.createElement("p");
        p.innerText = line.text;
        lyricsLines.appendChild(p);
      });
    })
    .catch(() => { lrcLyrics = []; });
}

function parseLRC(text) {
  return text.split("\n").map(line => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (!match) return null;
    return { time: parseInt(match[1]) * 60 + parseFloat(match[2]), text: match[3] };
  }).filter(Boolean);
}

// ===== SYNC + HIGHLIGHT =====
audio.addEventListener("timeupdate", () => {
  const lyricsLines = document.getElementById("lyricsLines");
  if (!lyricsLines || !lrcLyrics.length) return;

  const currentTime = audio.currentTime;
  let currentIndex = -1;
  for (let i = lrcLyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lrcLyrics[i].time) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex === lastHighlightedIndex || currentIndex < 0) return;

  lyricsLines.querySelectorAll("p").forEach(p => p.classList.remove("current"));
  const p = lyricsLines.children[currentIndex];
  if (p) {
    p.classList.add("current");
    p.scrollIntoView({ behavior: "smooth", block: "center" });
    lastHighlightedIndex = currentIndex;
  }
});

// ===== PLAY / PAUSE =====
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playBtn.innerText = "▶";
  } else {
    audio.play().catch(err => console.log(err));
    playBtn.innerText = "⏸";
  }
  isPlaying = !isPlaying;
  savePlayerState();
}

// ===== NEXT / PREV SONG =====
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play().catch(err => console.log(err));
  isPlaying = true;
  playBtn.innerText = "⏸";
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play().catch(err => console.log(err));
  isPlaying = true;
  playBtn.innerText = "⏸";
}

// ===== PLAYLIST =====
function renderPlaylist() {
  if (!playlistBox) return;
  playlistBox.innerHTML = "";
  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.innerText = `${song.title} - ${song.artist}`;
    div.classList.add("playlist-item");
    if (index === currentSongIndex) div.classList.add("active");
    div.onclick = () => { currentSongIndex = index; loadSong(index); audio.play(); isPlaying = true; playBtn.innerText = "⏸"; };
    playlistBox.appendChild(div);
  });
}

// ===== TOGGLE PLAYLIST =====
function togglePlaylist() { if (playlistBox) playlistBox.classList.toggle("show"); }

// ===== FAVORITE =====
favBtn.addEventListener("click", () => { favBtn.classList.toggle("active"); });

// ===== PROGRESS =====
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
progress.addEventListener("input", () => { audio.currentTime = (progress.value / 100) * audio.duration; });

// ===== AUTO NEXT =====
audio.addEventListener("ended", nextSong);

// ===== RELATED ARTISTS =====
function updateRelatedArtists(currentArtist) {
  const list = document.getElementById("relatedList");
  if (!list) return;
  list.innerHTML = "";
  relatedArtists.filter(a => a.name !== currentArtist).forEach(artist => {
    const div = document.createElement("div");
    div.className = "related-card";
    div.innerHTML = `<img src="${artist.img}"><p>${artist.name}</p><a href="${artist.link}" class="see-more">See More</a>`;
    list.appendChild(div);
  });
}

// ===== SAVE STATE =====
function savePlayerState() {
  const state = { currentSongIndex, isPlaying, currentTime: audio.currentTime };
  sessionStorage.setItem("playerState", JSON.stringify(state));
}
function restorePlayerState() {
  const savedState = sessionStorage.getItem("playerState");
  if (savedState) {
    const state = JSON.parse(savedState);
    currentSongIndex = state.currentSongIndex || 0;
    loadSong(currentSongIndex);
    if (state.currentTime) audio.currentTime = state.currentTime;
    if (state.isPlaying) { audio.play().catch(err => console.log(err)); isPlaying = true; playBtn.innerText = "⏸"; }
  } else { loadSong(currentSongIndex); }
}
window.addEventListener("beforeunload", savePlayerState);

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const songParam = urlParams.get("song");
  const artistParam = urlParams.get("artist");
  if (songParam && artistParam) loadSongFromArtist(artistParam, songParam);
  else restorePlayerState();
});

function loadSongFromArtist(artist, songTitle) {
  const songIndex = songs.findIndex(s => s.artist.toLowerCase() === artist.toLowerCase() && s.title.toLowerCase() === songTitle.toLowerCase());
  if (songIndex !== -1) { currentSongIndex = songIndex; loadSong(currentSongIndex); audio.play().catch(err => console.log(err)); isPlaying = true; playBtn.innerText = "⏸"; }
  else loadSong(currentSongIndex);
}

// ===== SHARE =====
function shareSong() {
  const song = songs[currentSongIndex];
  const shareText = `Check out "${song.title}" by ${song.artist} on QuietHub!`;
  if (navigator.share) navigator.share({ title: song.title, text: shareText, url: window.location.href }).catch(err => console.log(err));
  else navigator.clipboard.writeText(shareText).then(() => alert("Song info copied!"));
}
