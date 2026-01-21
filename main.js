
const episodeSelect = document.querySelector("#episodeSelect");
const seasonSelect = document.querySelector("#seasonSelect");
const mainPlayer = document.querySelector("#mainPlayer");
const videoSource = document.querySelector("#mainPlayer source");

const nextBtn = document.querySelector("#next-episode");
const prevBtn = document.querySelector("#prev-episode");

let interval;

const countEpisodes = [9, 7];

const links = {
    1: "https://nl107.cdnsqu.com/s/FHDEBcEdyj2e18qOX7eI3kI0FBQUFBQUFBQUFBUlZBQ2lndm9BbXpGZ1VVTT0.z6XcZH1HCjm8tqhkX01eLuVRLlrpleC8SGXKXw/The-Last-of-Us-2023-Dubl/",
    2: "https://nl109.werkecdn.me/s/FH6lwVW9l8Io1QXrD-9OKZSkFBQUFBQUFBQUFBUlZMRGpBUG9BbXpGZ1VVTT0.pvwpor3Fc2dVeITZh6gHrmYo_5hYKMmu47-PzA/The-Last-of-Us-2023-Dubl/",
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
