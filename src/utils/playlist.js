import axios from "axios";
import { stringSimilarity } from "string-similarity-js";

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

    const songList = set.set.filter((setItem) => setItem.name !== "");

    const promises = songList.map((setItem) => {
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

    let spotifySongIds = songResponses
      .filter((song) => song.data.tracks.items.length > 0)
      .map((songData, index) => {
        const song = songData.data.tracks.items[0];
        const searchedForSong = songList[index];
        const percentMatch = stringSimilarity(
          song?.name,
          searchedForSong?.name
        );

        if (percentMatch > 0.8) {
          return `spotify:track:${song.id}`;
        } else {
          return null;
        }
      });

    spotifySongIds = spotifySongIds.filter((element) => {
      return element !== undefined && element !== null;
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
