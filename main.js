
const episodeSelect = document.querySelector("#episodeSelect");
const seasonSelect = document.querySelector("#seasonSelect");
const mainPlayer = document.querySelector("#mainPlayer");
const videoSource = document.querySelector("#mainPlayer source");

const nextBtn = document.querySelector("#next-episode");
const prevBtn = document.querySelector("#prev-episode");

let interval;

const countEpisodes = [8, 9, 8, 9, 8];

const links = {
    1: "https://nl03.werkecdn.me/s/FHn6jIB-kjnYXESEFfkSGNWEFBQUFBQUFBQUFBUk5HRXl3L29BbXpGZ1VVTT0.ulfARfVJjP9y-NZXKWmQBCSb4-29Z5HUbmT8Ug/Stranger.Things.lostfilm/",
    2: "https://nl03.werkecdn.me/s/FHn6jIB-kjnYXESEFfkSGNWEFBQUFBQUFBQUFBUk5HRXl3L29BbXpGZ1VVTT0.ulfARfVJjP9y-NZXKWmQBCSb4-29Z5HUbmT8Ug/Stranger.Things.lostfilm/",
    3: "https://nl107.cdnsqu.com/s/FHirhIDyMvFGKG_nFCquSRhUFBQUFBQUFBQUFBUk5HSEVndm9BbXpGZ1VVTT0.XA8Pup2gp_dXeff36CZ4WNX8aFwYDBNErnu4cg/Stranger.Things.lostfilm/",
    4: "https://nl03.werkecdn.me/s/FHn6jIB-kjnYXESEFfkSGNWEFBQUFBQUFBQUFBUk5HRXl3L29BbXpGZ1VVTT0.ulfARfVJjP9y-NZXKWmQBCSb4-29Z5HUbmT8Ug/Stranger.Things.lostfilm/",
    5: "https://nl215.werkecdn.me/s/FHxceVTh5y87wzrUzy3jy2f0FBQUFBQUFBQUFBUk5FSUJRZm9BbXpGZ1VVTT0.QyUiZwzvz2P3QxowErajDTVS8C7nE1Z53uFCkw/Stranger.Things.lostfilm/"
};

function createSelectList(count, text) {
    let items = [];
    for (let i = 1; i <= count; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${text} ${i}`;
        items.push(option);
    }
    
    return items;
}

let saveInfo = JSON.parse(localStorage.getItem("currentTime")) || {season: 1, episode: 1, time: 0};

let isFirstLoad = true;

seasonSelect.replaceChildren(...createSelectList(countEpisodes.length, "Сезон"));
seasonSelect.value = saveInfo.season;

console.log(seasonSelect.value);


episodeSelect.replaceChildren(...createSelectList(countEpisodes[+seasonSelect.value-1], "Епізод"));
episodeSelect.value = saveInfo.episode;

updateVideo(seasonSelect.value, episodeSelect.value);

mainPlayer.addEventListener("loadedmetadata", () => {

    if (isFirstLoad) {
        mainPlayer.currentTime = saveInfo.time;
        isFirstLoad = false;
    } else {
        mainPlayer.currentTime = 0;
    }
});

mainPlayer.addEventListener("timeupdate", () => {
    localStorage.setItem("currentTime", JSON.stringify({
        season: +seasonSelect.value,
        episode: +episodeSelect.value,
        time: mainPlayer.currentTime
    }));

    if (mainPlayer.currentTime === mainPlayer.duration) {
        nextEpisode();
    }
});


function getVideo(season, episode) {
    if (episode < 1 || season < 1) return;
    if (!Number.isInteger(episode) || !Number.isInteger(episode)) return;

    const epsd = episode < 10 ? `0${episode}` : episode;
    const s = season < 10 ? `0${season}` : season;

    const link = links[season] + `s${s}e${epsd}_720.mp4`;

    return link;
}

function updateVideo(season, episode) {
    const link = getVideo(+season, +episode);
    videoSource.src = link;
    mainPlayer.load();
}

function nextEpisode() {
    let s = Number(seasonSelect.value);
    let e = Number(episodeSelect.value);

    let currentSeasonIndex = s - 1;
    let totalEpisodesInSeason = countEpisodes[currentSeasonIndex];

    if (e < totalEpisodesInSeason) {
        e++;
    } else if (s < countEpisodes.length) {
        s++;
        e = 1;

        episodeSelect.replaceChildren(...createSelectList(countEpisodes[s - 1], "Серія"));
    } else {
        alert("Ви подивилися весь серіал!");
        return;
    }

    seasonSelect.value = s;
    episodeSelect.value = e;

    isFirstLoad = false;
    saveInfo.time = 0;

    updateVideo(s, e);
    mainPlayer.play();
}

episodeSelect.addEventListener("change", () => {
    updateVideo(seasonSelect.value, episodeSelect.value);
});

seasonSelect.addEventListener("change", () => {
    updateVideo(seasonSelect.value, episodeSelect.value);
    episodeSelect.replaceChildren(...createSelectList(countEpisodes[+seasonSelect.value-1], "Епізод"));
});

nextBtn.addEventListener("click", () => {
    nextEpisode();
});
