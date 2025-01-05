import { createPlaylist } from "@/utils/playlist";
import { useRouter } from "next/router";

function getAcessToken(hash) {
  if (hash.substring(0, 6) === "access") {
    return hash.substring(13, hash.search("&"));
  }
  return undefined;
}

const SetlistExplorer = ({ selectedSetlist, playlistUri, setPlaylistUri }) => {
  const router = useRouter();
  // $scope.ACCESS_TOKEN = getAcessToken($location.hash());

  const onCreatePlaylistClick = async () => {
    const accessToken = getAcessToken(router.asPath.split("#")[1]);

    if (selectedSetlist === undefined) {
      // $scope.error = 'No setlist selected';
    } else {
      // $scope.error = ' ';
      if (accessToken) {
        //TODO Error handlind
        const playlistRepsonse = await createPlaylist(
          selectedSetlist,
          accessToken
        );

        if (playlistRepsonse.success) {
          setPlaylistUri(playlistRepsonse.uri);
        } else {
          console.error(playlistRepsonse.error);
        }

        //   songFactory.createPlaylist(set, $scope.ACCESS_TOKEN, (res) => {
        //     if (typeof res === 'string') {
        //       $scope.playlistURI = res;
        //     } else {
        //       $scope.error = 'You need to log back in to Spotify';
        //     }
        //   });
      } else {
        //   $scope.error = 'You need to sign in to Spotify';
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
                <li key={`${song.name}-${index}`}>{song.name}</li> // TODO Fix index
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
