import axios from "axios";

export const createPlaylist = async (set, accessToken, callback) => {
  // Need full set data, not just this specific set
  // Something weird with search and selecting. Getting random songs not by that artist

  try {
    const { data: userData } = await axios.get(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userId = userData.id;

    const { data: playlistData } = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: `${set.artist} - ${set.title}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const uri = playlistData.uri;
    const playlistId = playlistData.id;

    const promises = set.set
      .filter((setItem) => setItem.name !== "")
      .map((setItem) => {
        const trackName = setItem.name;
        let trackArtist = set.artist;
        if (setItem.cover) {
          trackArtist = setItem.cover.name;
        }
        return axios.get(
          `https://api.spotify.com/v1/search?query=${encodeURIComponent(
            trackName
          )}+${encodeURIComponent(trackArtist)}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      });

    const songResponses = await Promise.all(promises);

    console.log(songResponses);

    let spotifySongIds = songResponses
      .filter((song) => song.data.tracks.items.length > 0)
      .map((song) => {
        return `spotify:track:${song.data.tracks.items[0].id}`;
      });

    spotifySongIds = spotifySongIds.filter((element) => {
      return element !== undefined;
    });

    await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      {
        uris: spotifySongIds,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, uri };
  } catch (error) {
    return { success: false, error };
  }
};
