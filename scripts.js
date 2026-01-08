/*const playBtn = document.querySelector(".play");*/
let playing = false;

playBtn.addEventListener("click", () => {
  playing = !playing;
  playBtn.textContent = playing ? "⏸" : "▶";
});


const audio = document.getElementById("audioPlayer");
/*const playBtn = document.querySelector(".play");*/
const songTitle = document.querySelector(".song-info strong");
const songArtist = document.querySelector(".song-info span");
const albumArt = document.querySelector(".album-art");

let isPlaying = false;

// Click song to play
document.querySelectorAll(".album-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const src = link.dataset.src;
    const title = link.dataset.title;
    const artist = link.dataset.artist;
    const cover = link.dataset.cover;

    audio.src = src;
    audio.play();

    songTitle.textContent = title;
    songArtist.textContent = artist;
    albumArt.style.backgroundImage = `url(${cover})`;

    playBtn.textContent = "⏸";
    isPlaying = true;
  });
});

// Play / Pause button
playBtn.addEventListener("click", () => {
  if (!audio.src) return;

  if (isPlaying) {
    audio.pause();
    playBtn.textContent = "▶";
  } else {
    audio.play();
    playBtn.textContent = "⏸";
  }
  isPlaying = !isPlaying;
});




/*ain part*/

/* =================== GLOBAL ELEMENTS =================== */
const audioPlayer = document.getElementById("audioPlayer") || document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const favBtn = document.getElementById("favBtn");
const titleEl = document.getElementById("songTitle");
const artistEl = document.getElementById("songArtist");
const lyricsBox = document.getElementById("lyrics");
const relatedList = document.getElementById("relatedList");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const songListDiv = document.getElementById("artistSongs");

/* =================== DATA =================== */
const artists = [
  {
    name:"Rosé",
    img:"images/rose.jpg",
    genre:"Pop",
    songs:[
      {title:"Number One Girl", file:"songs/numberonegirl.mp3", lyrics:[
        {time:0, text:"🎤 Tell me that I'm special tell me I look pretty"},
        {time:5, text:"🎶 Tell me I'm a little angel, your city’s sweetheart"},
        {time:10, text:"🎶 Say what I'm dying to hear, I'm waiting for you"},
        {time:15, text:"🎶 Isn't it lonely?"},
        {time:20, text:"🎶 I'd do anything to make you want me"},
        {time:25, text:"🎶 I'd give it all up if you told me I'd be"},
        {time:30, text:"🎶 The number one girl in your eyes"}
      ]},
      {title:"On The Ground", file:"songs/ontheground.mp3", lyrics:[]},
      {title:"Gone", file:"songs/gone.mp3", lyrics:[]}
    ]
  },
  {
    name:"Blackpink",
    img:"images/blackpink.jpg",
    genre:"K-Pop",
    songs:[
      {title:"How You Like That", file:"songs/howyoulikethat.mp3", lyrics:[]},
      {title:"Kill This Love", file:"songs/killthislove.mp3", lyrics:[]}
    ]
  },
  {
    name:"IU",
    img:"images/iu.jpg",
    genre:"K-Pop",
    songs:[
      {title:"Eight", file:"songs/eight.mp3", lyrics:[]},
      {title:"Love Poem", file:"songs/lovepoem.mp3", lyrics:[]}
    ]
  },
  {
    name:"BTS",
    img:"images/bts.jpg",
    genre:"K-Pop",
    songs:[
      {title:"Dynamite", file:"songs/dynamite.mp3", lyrics:[]},
      {title:"Butter", file:"songs/butter.mp3", lyrics:[]}
    ]
  }
];

/* =================== PLAYER FUNCTIONS =================== */
function loadSong(song){
  if(!audioPlayer) return;

  audioPlayer.src = song.file;
  if(titleEl) titleEl.textContent = song.title;
  if(artistEl) artistEl.textContent = currentArtist.name;

  // Lyrics
  if(lyricsBox){
    lyricsBox.innerHTML = "<h4>Lyrics</h4>";
    song.lyrics.forEach(l=>{
      const p = document.createElement("p");
      p.dataset.time = l.time;
      p.textContent = l.text;
      lyricsBox.appendChild(p);
    });
  }

  // Related artists
  if(relatedList){
    relatedList.innerHTML = "";
    artists.filter(a=>a.name !== currentArtist.name).forEach(a=>{
      relatedList.innerHTML += `
        <div class="artist-card">
          <div class="artist-img"><img src="${a.img}" alt="${a.name}"></div>
          <h4>${a.name}</h4>
        </div>`;
    });
  }
}

// Play / Pause
function togglePlay(){
  if(audioPlayer.paused){
    audioPlayer.play();
    if(playBtn) playBtn.textContent = "⏸";
  } else {
    audioPlayer.pause();
    if(playBtn) playBtn.textContent = "▶";
  }
}

// Favourite
if(favBtn) favBtn.addEventListener('click', ()=>favBtn.classList.toggle('active'));

// Audio time update
if(audioPlayer){
  audioPlayer.addEventListener("timeupdate", ()=>{
    if(progress) progress.value = audioPlayer.currentTime;
    if(currentTime) currentTime.textContent = formatTime(audioPlayer.currentTime);
    highlightCurrentLyric(audioPlayer.currentTime);
  });

  audioPlayer.addEventListener("loadedmetadata", ()=>{
    if(progress) progress.max = audioPlayer.duration;
    if(duration) duration.textContent = formatTime(audioPlayer.duration);
  });
}

// Format time
function formatTime(sec){
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

// Highlight lyrics
function highlightCurrentLyric(currentTime){
  if(!lyricsBox) return;
  const lyrics = lyricsBox.querySelectorAll("p");
  lyrics.forEach((p,i)=>{
    const time = parseFloat(p.dataset.time);
    const next = lyrics[i+1];
    let nextTime = next ? parseFloat(next.dataset.time) : Infinity;
    if(currentTime >= time && currentTime < nextTime){
      if(!p.classList.contains("current")){
        lyrics.forEach(l=>l.classList.remove("current"));
        p.classList.add("current");
        lyricsBox.scrollTop = p.offsetTop - lyricsBox.clientHeight/2 + p.offsetHeight/2;
      }
    }
  });
}

/* =================== ARTIST PAGE =================== */
let currentArtist = artists[0]; // default

function loadArtistDetail(){
  const artistName = localStorage.getItem('artistName') || "Rosé";
  const artist = artists.find(a=>a.name===artistName);
  if(!artist) return;
  currentArtist = artist;

  const artistImg = document.getElementById('artistImg');
  const artistNameEl = document.getElementById('artistName');
  const artistGenreEl = document.getElementById('artistGenre');

  if(artistImg) artistImg.src = artist.img;
  if(artistNameEl) artistNameEl.textContent = artist.name;
  if(artistGenreEl) artistGenreEl.textContent = artist.genre;

  if(songListDiv){
    songListDiv.innerHTML = "";
    artist.songs.forEach((song,index)=>{
      const p = document.createElement('p');
      p.textContent = song.title;
      p.onclick = ()=> {
        playSong(song,index);
      };
      songListDiv.appendChild(p);
    });
  }
}

function playSong(song,index){
  if(songListDiv){
    document.querySelectorAll('.song-list p').forEach(p=>p.classList.remove('active'));
    if(document.querySelectorAll('.song-list p')[index])
      document.querySelectorAll('.song-list p')[index].classList.add('active');
  }

  if(audioPlayer){
    audioPlayer.src = song.file;
    audioPlayer.play();
  }

  loadSong(song);
}

/* =================== INIT =================== */
loadArtistDetail();
if(artists[0] && artists[0].songs[0]) loadSong(artists[0].songs[0]);


// ===== SONG LIST =====
const songs = [
  {
    title: "Hana",
    artist: "Zerobaseone",
    src: "mp3/hana.mp3",
    cover: "picture/prezent.png"
  },
  {
    title: "Now Or Never",
    artist: "Zerobaseone",
    src: "mp3/now-or-never.mp3",
    cover: "picture/prezent.png"
  },
  {
    title: "Only One Story",
    artist: "Zerobaseone",
    src: "mp3/only-one-story.mp3",
    cover: "picture/prezent.png"
  },
  {
    title: "Blue",
    artist: "Zerobaseone",
    src: "mp3/blue.mp3",
    cover: "picture/blue-paradise.png"
  },
  {
    title: "Devil Game",
    artist: "Zerobaseone",
    src: "mp3/devil-game.mp3",
    cover: "picture/blue-paradise.png"
  },
  {
    title: "Out Of Love",
    artist: "Zerobaseone",
    src: "mp3/out-of-love.mp3",
    cover: "picture/blue-paradise.png"
  },
  {
    title: "Bad Desire",
    artist: "Enhypen",
    src: "mp3/bad-desire.mp3",
    cover: "picture/desire.png"
  },
  {
    title: "Helium",
    artist: "Enhypen",
    src: "mp3/helium.mp3",
    cover: "picture/desire.png"
  },
  {
    title: "Into The I Land",
    artist: "IU",
    src: "mp3/into-the-iland.mp3",
    cover: "picture/into-the-iland.png"
  },
];

// ===== VARIABLES =====
let currentSongIndex = 0;

// ===== ELEMENTS =====

const currentTimeEl = document.getElementById("currentTime");
const playlistBox = document.getElementById("playlistBox");

// ===== LOAD SONG =====
function loadSong(index) {
  audio.src = songs[index].src;
  document.querySelector(".player-section-album-cover img").src =
    songs[index].cover;
  document.querySelector(".player-section-song-box h3").innerText =
    songs[index].title;
  document.querySelector(".player-section-song-box p").innerText =
    songs[index].artist;
}

loadSong(currentSongIndex);

// ===== PLAY / PAUSE =====
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playBtn.innerText = "▶";
  } else {
    audio.play();
    playBtn.innerText = "⏸";
  }
  isPlaying = !isPlaying;
}

// ===== NEXT SONG =====
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  isPlaying = true;
  playBtn.innerText = "⏸";
}

// ===== PREVIOUS SONG =====
function prevSong() {
  currentSongIndex =
    (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  isPlaying = true;
  playBtn.innerText = "⏸";
}

// ===== UPDATE PROGRESS =====
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;

  let minutes = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime % 60);
  if (seconds < 10) seconds = "0" + seconds;

  currentTimeEl.innerText = `${minutes}:${seconds}`;
});

// ===== SEEK SONG =====
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// ===== PLAYLIST =====
function togglePlaylist() {
  playlistBox.classList.toggle("show");
}
function renderPlaylist() {
  playlistBox.innerHTML = "";

  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.innerText = `${song.title} - ${song.artist}`;

    if (index === currentSongIndex) {
      div.style.color = "#1db954";
    }

    div.onclick = () => {
      currentSongIndex = index;
      loadSong(index);
      audio.play();
      isPlaying = true;
      playBtn.innerText = "⏸";
      renderPlaylist();
    };

    playlistBox.appendChild(div);
  });
}


renderPlaylist();

// ===== FAVORITE =====

favBtn.addEventListener("click", () => {
  favBtn.classList.toggle("active");
});

// ===== SHARE =====
function shareSong() {
  alert("Song link copied (demo)");
}
