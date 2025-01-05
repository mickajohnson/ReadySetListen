import axios from "axios";

const { useState } = require("react");

const SearchArtist = ({ selectedArtist, setSelectedArtist }) => {
  const [artist, setArtist] = useState();
  const [artists, setArtists] = useState([]);
  const [displayIndex, setDisplayIndex] = useState(0);

  const getArtist = async () => {
    const response = await axios.get(
      `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(
        artist
      )}&fmt=json`
      // {
      //   headers: {
      //     "User-Agent": "ReadySetListen/0.0.1 ( mickalsipjohnson@gmail.com )",
      //   },
      // }
    );

    if (response.status === 503) {
      //   res.json({ error: "Servers Busy" });
    } else if (response.status === 200) {
      setArtists(response.data.artists);
    } else {
      //   res.json({ error: "Server Error" });
    }
  };

  const searchArtist = (event) => {
    if (event.key === "Enter") {
      getArtist();
    }
  };

  const filteredArtists = artists.slice(displayIndex, displayIndex + 3);

  return (
    <div id="search-container" ng-if="searchable">
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
