const clientId = "9b278268f5ec46a09e48f926d94fd17c";
const clientSecret = "982ebc393b5e41faa0d0f39a3af59c5a";

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",

      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },

    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Fallo al obtener el token: " + response.statusText);
  }

  const data = await response.json();

  return data.access_token;
}

async function buscarSpotify(query) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=$?q=$${encodeURIComponent(
        query
      )}&type=album,artist&limit=10`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Fallo en la búsqueda de Spotify: " + response.statusText
      );
    }

    const data = await response.json();

    console.log("Resultados:", data);

    displayResults(data, query);
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    document.getElementById(
      "results-container"
    ).innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

function displayResults(data, query) {
  const container = document.getElementById("results-container");

  
  const filteredAlbums = data.albums.items.filter((album) => {
 
    return album.artists.some((artist) =>

      artist.name.toLowerCase().includes(query.toLowerCase())
    );
  });

 
  if (filteredAlbums.length > 0) {
    let html = `<h3>Álbumes De "${query}":</h3><ul class="album-list">`;

    filteredAlbums.forEach((album) => {
      const img = album.images[0]?.url || "placeholder.png";

      const artistsNames = album.artists.map((a) => a.name).join(", ");

      html += `<li class="album-item">
                        <img src="${img}" class="album-cover">
                        <div class="album-info">
                            <strong>${album.name}</strong>
                            <p>${artistsNames}</p>
                        </div>
                    </li>`;
    });

    html += "</ul>";
    container.innerHTML = html;
    return;
  }

  container.innerHTML = `<h3>No se encontraron álbumes de "${query}".</h3>`;
}

const searchButton = document.getElementById("search-button");
const artistInput = document.getElementById("artist-input");

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const artistName = artistInput.value.trim();
  const resultsContainer = document.getElementById("results-container");

  if (!artistName) {
    resultsContainer.innerHTML =
      '<p class="placeholder-text">Por favor, ingresa el nombre de una banda o artista.</p>';
    return;
  }

  resultsContainer.innerHTML = '<p class="placeholder-text">Buscando...</p>';
  buscarSpotify(artistName);
});
