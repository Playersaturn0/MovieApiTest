async function fetchMediaData(mediaTitle) {
  const apiKey = "33bf94c456bb76862fc5e1e99a84cb6e";
  const language = window.navigator.language || "en-US";
  const sanitizedTitle = mediaTitle.trim();
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${sanitizedTitle}&language=${language}&include_adult=false`
  );
  const data = await response.json();
  return data.results[0];
}

async function fetchGenreNames(genreIds) {
  const apiKey = "33bf94c456bb76862fc5e1e99a84cb6e";
  const language = window.navigator.language || "en-US";
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${language}`
  );
  const data = await response.json();
  const genreNames = genreIds.map((genreId) => {
    const genre = data.genres.find((genre) => genre.id === genreId);
    return genre ? genre.name : "";
  });
  return genreNames;
}

async function renderMediaInfo(mediaTitle) {
  const mediaData = await fetchMediaData(mediaTitle);
  console.log(mediaData);

  const movieInfoDisplay = document.querySelector("#movieInfoDisplay");
  movieInfoDisplay.innerHTML = "";

  const posterUrl = `https://image.tmdb.org/t/p/original${mediaData.poster_path}`;

  // Header
  let header = document.createElement("div");
  header.setAttribute("class", "movieInfoHeader"); // Added class
  let poster = document.createElement("img");
  poster.setAttribute("class", "poster"); // Added class
  poster.setAttribute("src", posterUrl);
  let title = document.createElement("h1");
  title.setAttribute("class", "movieTitle"); // Added class
  title.innerText =
    mediaData.media_type === "movie" ? mediaData.title : mediaData.name;

  // Additional information
  let info = document.createElement("div");
  info.setAttribute("class", "movieInfo"); // Added class
  let popularity = document.createElement("p");
  popularity.setAttribute("class", "popularity"); // Added class
  popularity.innerText = `Popularity: ${mediaData.popularity}`;
  let genreIds = mediaData.genre_ids || [];
  let genreNames = await fetchGenreNames(genreIds);

  // Create genre tag boxes
  let genreContainer = document.createElement("div");
  genreContainer.setAttribute("class", "genre-container");

  genreNames.forEach((genreName) => {
    let genreTag = document.createElement("span");
    genreTag.setAttribute("class", "genre-tag");
    genreTag.innerText = genreName;
    genreContainer.appendChild(genreTag);
  });

  // Body
  let body = document.createElement("div");
  let overview = document.createElement("p");
  overview.setAttribute("class", "overview"); // Added class
  overview.innerText = mediaData.overview;

  header.append(poster, title);
  info.append(popularity, genreContainer);
  body.append(overview);
  movieInfoDisplay.append(header, info, body);
}

const form = document
  .querySelector("#movieSearchForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const movieTitle = document.querySelector("#movieName");
    renderMediaInfo(movieTitle.value);
  });
