import axios from "axios";

const { useState } = require("react");

const SearchArtist = ({ selectedArtist, setSelectedArtist, setError }) => {
  const [artist, setArtist] = useState("");
  const [artists, setArtists] = useState([]);
  const [displayIndex, setDisplayIndex] = useState(0);

  const getArtist = async () => {
    setError(null);

    const response = await axios.get(
      `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(
        artist
      )}&fmt=json`
    );

    if (response.status === 200) {
      setArtists(response.data.artists);
    } else {
      setError("Hmmm something went wrong - try again in a second");
    }
  };

  const searchArtist = (event) => {
    if (event.key === "Enter") {
      if (artist.length < 1) {
        setError("No artist entered");
      } else {
        getArtist();
      }
    }
  };

  const filteredArtists = artists.slice(displayIndex, displayIndex + 3);

  return (
    <div id="search-container">
      <div className="sub-container">
        <label>Search artist to create setlist-based Spotify playlist</label>
        <input
          onKeyDown={searchArtist}
          onChange={(e) => setArtist(e.target.value)}
          value={artist}
        />

        {artists && artists.length ? (
          <ul>
            {filteredArtists.map((artist) => (
              <li key={artist.id} onClick={() => setSelectedArtist(artist.id)}>
                <p
                  className={
                    selectedArtist === artist.id ? "selected_artist" : ""
                  }
                >
                  {artist.name}
                </p>
                ?
              </li>
            ))}

            <li onClick={() => setDisplayIndex((curr) => curr + 3)}>
              <p>See More...</p>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default SearchArtist;
