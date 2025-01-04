const SetlistExplorer = ({selectedSetlist}) => {
  return (
    <div id="setlist-container">
        <div
        ng-if="playlistURI === 'spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf'"
        >
        <div className="list-box">
            <ol>
                {selectedSetlist.map((song => (
                    <li>{song.name}</li>
                )))}
           
            </ol>
        </div>
        <button
            type="button"
            name="button"
            ng-click="createPlaylist(setlists[selectedSetlist])"
        >
            Create Playlist
        </button>
        </div>
        {/* <iframe
        ng-show="playlistURI !== 'spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf'"
        ng-src="{{getIframeSrc(playlistURI)}}"
        frameborder="0"
        allowtransparency="true"
        ></iframe> */}
  </div> )

}

export default SetlistExplorer