const playBtn = document.querySelector(".play");
let playing = false;

playBtn.addEventListener("click", () => {
  playing = !playing;
  playBtn.textContent = playing ? "⏸" : "▶";
});
