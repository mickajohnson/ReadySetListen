import { createPlaylist } from "@/utils/playlist";
import { useRouter } from "next/router";

function getAcessToken(hash) {
  if (hash.substring(0, 6) === "access") {
    return hash.substring(13, hash.search("&"));
  }
  return undefined;
}

const SetlistExplorer = ({
  selectedSetlist,
  playlistUri,
  setPlaylistUri,
  setError,
}) => {
  const router = useRouter();

  const onCreatePlaylistClick = async () => {
    setError(null);

    const accessToken = getAcessToken(router.asPath.split("#")[1]);

    if (selectedSetlist === undefined) {
      setError("No setlist selected");
    } else {
      if (accessToken) {
        const playlistRepsonse = await createPlaylist(
          selectedSetlist,
          accessToken
        );

        if (playlistRepsonse.success) {
          setPlaylistUri(playlistRepsonse.uri);
        } else {
          console.error(playlistRepsonse.error);
          setError("You need to log back in to Spotify");
        }
      } else {
        setError("You need to sign in to Spotify");
      }
    }
  };

  return (
    <div id="setlist-container">
      {playlistUri ? (
        <iframe
          src={`https://open.spotify.com/embed?uri=${playlistUri}`}
          frameborder="0"
          allowtransparency="true"
        ></iframe>
      ) : (
        <div>
          <div className="list-box">
            <ol>
              {selectedSetlist.set.map((song, index) => (
                <li key={`${song.name}-${index}`}>{song.name}</li>
              ))}
            </ol>
          </div>
          <button type="button" name="button" onClick={onCreatePlaylistClick}>
            Create Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default SetlistExplorer;
