document.addEventListener('DOMContentLoaded', () => {
    const songs = [
        {
            title: "Crazy Little Thing Called Love",
            file: "assets/audio/Queen - Crazy Little Thing Called Love.mp3",
            artist: "Queen"
        },
        {
            title: "L-O-V-E",
            file: "assets/audio/Nat King Cole - L-O-V-E.mp3",
            artist: "Nat King Cole"
        },
        {
            title: "You Make My Dreams (Come True)",
            file: "assets/audio/Daryl Hall & John Oates - You Make My Dreams (Come True).mp3",
            artist: "Daryl Hall & John Oates"
        },
        {
            title: "Don't Go Breaking My Heart",
            file: "assets/audio/Elton John - Don't Go Breaking My Heart.mp3",
            artist: "Elton John & Kiki Dee"
        }
    ];

    // Elementos
    const $ = (id) => document.getElementById(id);
    const audio = $('audioPlayer');
    const musicBtn = $('musicBtn');
    const musicPanel = $('musicControls');
    const nowPlaying = $('nowPlaying');
    const songArtist = $('songArtist');
    const playPauseBtn = $('playPauseBtn');
    const playIcon = $('playIcon');
    const pauseIcon = $('pauseIcon');
    const prevBtn = $('prevBtn');
    const nextBtn = $('nextBtn');
    const progressBar = $('progressBar');
    const currentTime = $('currentTime');
    const duration = $('duration');
    const volumeSlider = $('volumeSlider');

    let currentSong = Math.floor(Math.random() * songs.length);
    let isPlaying = false;
    let history = [];
    let autoCloseTimeout = null;

    function loadSong(index) {
        const song = songs[index];
        audio.src = song.file;
        nowPlaying.textContent = song.title;
        songArtist.textContent = song.artist;

        audio.onloadedmetadata = () => {
            duration.textContent = formatTime(audio.duration);
            if (isPlaying) audio.play();
        };
    }

    function formatTime(sec) {
        if (isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function updateProgress() {
        if (audio.duration) {
            currentTime.textContent = formatTime(audio.currentTime);
            progressBar.value = (audio.currentTime / audio.duration) * 100;
        }
    }

    function togglePlayPause() {
        if (!audio.src) loadSong(currentSong);
        if (audio.paused) {
            audio.play();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
        updatePlayPauseIcon();
    }

    function updatePlayPauseIcon() {
        playIcon.style.display = isPlaying ? 'none' : 'block';
        pauseIcon.style.display = isPlaying ? 'block' : 'none';
    }

    function nextTrack() {
        history.push(currentSong);
        currentSong = (currentSong + 1) % songs.length;
        loadSong(currentSong);
        if (isPlaying) audio.play();
        startAutoCloseTimer();
    }

    function prevTrack() {
        if (history.length && audio.currentTime < 3) {
            currentSong = history.pop();
        } else {
            audio.currentTime = 0;
            return;
        }
        loadSong(currentSong);
        if (isPlaying) audio.play();
        startAutoCloseTimer();
    }

    // === EVENTOS ===
    playPauseBtn.addEventListener('click', () => {
        togglePlayPause();
        startAutoCloseTimer();
    });

    nextBtn.addEventListener('click', () => {
        nextTrack();
        startAutoCloseTimer();
    });

    prevBtn.addEventListener('click', () => {
        prevTrack();
        startAutoCloseTimer();
    });

    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
        startAutoCloseTimer();
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        startAutoCloseTimer();
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);

    // === BOTÓN FLOTANTE ===
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel(musicPanel);
    });

    document.addEventListener('click', (e) => {
        if (!musicPanel.contains(e.target) && e.target !== musicBtn) {
            musicPanel.classList.remove('visible');
        }
    });

    function togglePanel(panel) {
        const isVisible = panel.classList.toggle('visible');

        if (panel === musicPanel) {
            if (isVisible) {
                startAutoCloseTimer();
            } else {
                clearTimeout(autoCloseTimeout);
            }
        }
    }

    function startAutoCloseTimer() {
        clearTimeout(autoCloseTimeout);
        autoCloseTimeout = setTimeout(() => {
            musicPanel.classList.remove('visible');
        }, 6000); // 6 segundos
    }

    musicPanel.addEventListener('mouseover', startAutoCloseTimer);

    // === INICIALIZACIÓN ===
    audio.volume = volumeSlider.value;
    loadSong(0);
    updatePlayPauseIcon();

    // === AUTOPLAY DISFRAZADO: reproducción tras interacción confiable ===
let userHasInteracted = false;

function tryAutoPlay() {
    if (userHasInteracted) return;
    userHasInteracted = true;

    // Cargamos si aún no lo hiciste
    if (!audio.src) loadSong(currentSong);

    audio.play().then(() => {
        isPlaying = true;
        updatePlayPauseIcon();
        console.log("✅ Música iniciada tras interacción");
    }).catch((err) => {
        console.warn("❌ Reproducción bloqueada:", err);
    });

    // Quitamos los listeners para no seguir intentando
    ['click', 'keydown', 'touchstart'].forEach(event =>
        document.removeEventListener(event, tryAutoPlay)
    );
}

// Solo usamos eventos de interacción directa
['click', 'keydown', 'touchstart'].forEach(event =>
    document.addEventListener(event, tryAutoPlay, { once: true })
);
});
