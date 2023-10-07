
const player = document.querySelector(".player"),
    playPauseBtn = player.querySelector(".play-pause-btn"),
    prevBtn = player.querySelector(".prev-btn"),
    nextBtn = player.querySelector(".next-btn"),
    poster = player.querySelector(".img"),
    audio = player.querySelector("audio"),
    time = player.querySelector(".time"),
    duration = player.querySelector(".duration"),
    artist = player.querySelector(".artist"),
    name = player.querySelector(".name"),
    progressBar = player.querySelector(".progress-bar"),
    progress = player.querySelector(".progress"),
    statusBtn = player.querySelector(".status-btn"),
    listBtn = player.querySelector(".list-btn"),
    musicList = player.querySelector(".music-list"),
    listCloseBtn = musicList.querySelector(".close");

let currentSong = 0;

function loadMusic(index) {
    const song = songs[currentSong];
    name.textContent = song.name;
    artist.textContent = song.artist;
    poster.src = song.poster;
    audio.src = song.audio;
    time.textContent = '00:00';
}

loadMusic();

function playSong() {
    audio.classList.add("playing");
    playPauseBtn.firstElementChild.className = "fa-solid fa-pause";
    audio.play();
}

function pauseSong() {
    audio.classList.remove("playing");
    playPauseBtn.firstElementChild.className = "fa-solid fa-play";
    audio.pause();
}

playPauseBtn.addEventListener("click", () => {
    if (!audio.classList.contains("playing"))
        playSong();
    else
        pauseSong();
});

prevBtn.addEventListener("click", () => {
    currentSong = (--currentSong + songs.length) % songs.length;
    loadMusic()
    playSong();
});

function playNextSong() {
    currentSong = ++currentSong % songs.length;
    loadMusic();
    playSong();
}

nextBtn.addEventListener("click", playNextSong);

function getTimeFromSeconds(seconds) {
    let s = Math.floor(seconds) % 60;
    let m = Math.floor(seconds / 60);

    s = s < 10 ? `0${s}` : s;
    m = m < 10 ? `0${m}` : m;

    return `${m}:${s}`;
}


audio.addEventListener("loadeddata", () => {
    duration.textContent = getTimeFromSeconds(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    time.textContent = getTimeFromSeconds(audio.currentTime);
    progress.style.width = `${audio.currentTime / audio.duration * 100}%`;
});

audio.addEventListener("ended", () => {
    switch (statusBtn.className) {
        case "fa-solid fa-repeat status-btn":
            playNextSong();
            break;
        case "fa-solid fa-shuffle status-btn":
            while (songs.length > 1) {
                let newSong = Math.floor(Math.random() * songs.length);
                if (currentSong != newSong) {
                    currentSong = newSong;
                    break;
                }
            }
            loadMusic();
            playSong();
            break;
    }
});

document.addEventListener("wheel", e => {
    e.preventDefault();
    if (e.deltaY > 0)
        audio.volume = audio.volume < 0.05 ? audio.volume : audio.volume - .1;
    else
        audio.volume = audio.volume > 0.95 ? audio.volume : audio.volume + .1;;
})

statusBtn.addEventListener("click", () => {
    switch (statusBtn.className) {
        case "fa-solid fa-repeat status-btn":
            statusBtn.className = "fa-solid fa-shuffle status-btn";
            statusBtn.title = "playlist shuffled";
            break;
        case "fa-solid fa-shuffle status-btn":
            statusBtn.className = "fa-solid fa-repeat status-btn";
            statusBtn.title = "playlist looped";
            break;
    }
});

progressBar.addEventListener("mousedown", e => {
    audio.currentTime = e.offsetX / progressBar.clientWidth * audio.duration;
});

let isDragging = false;
let clientXStart = 0;
let progressWidthStart = 0;

progressBar.addEventListener("mousedown", e => {
    clientXStart = e.clientX;
    progressWidthStart = e.offsetX;
    isDragging = true;
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

window.addEventListener("mousemove", e => {
    if (isDragging) {
        const distance = e.clientX - clientXStart;
        const progressWidth = progressWidthStart + distance;
        audio.currentTime = progressWidth / progressBar.clientWidth * audio.duration;
    }
});

listBtn.addEventListener("click", () => {
    musicList.classList.add("active");
});


listCloseBtn.addEventListener("click", () => {
    musicList.classList.remove("active");
});


function loadList() {
    const ul = musicList.querySelector("ul");
    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="detail">
                            <span class="name">${song.name}</span>
                            <span class="artist">${song.artist}</span>
                        </div>
                      <span class="duration">00:00</span>
                      <audio src="${song.audio}"></audio>`;

        if (index == 0)
            li.className = 'active';

        ul.append(li);
        const liAduio = li.querySelector(`audio`);
        liAduio.addEventListener("loadeddata", () => li.querySelector(`.duration`).textContent = getTimeFromSeconds(liAduio.duration));
    });

    const lists = ul.querySelectorAll("li");

    lists.forEach((li, index) => {
        li.addEventListener("click", () => {
            currentSong = index;
            loadMusic();
            playSong();

            li.classList.add("active");
            lists.forEach((li, idx) => {
                if (idx != index)
                    li.classList.remove("active");
            })
        })
    })
}

loadList();


