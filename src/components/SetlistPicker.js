const SetlistPicker = ({ setlists, setSelectedSetlist, selectedSetlist }) => {
  return (
    <div id="setlist-select-container">
      <div className="sub-container">
        <div className="list-box">
          <ul>
            {setlists.map((setlist, index) => (
              <li
                key={index} // TODO Fix
                className={index === selectedSetlist ? "selected_setlist" : ""}
                onClick={() => setSelectedSetlist(index)}
              >
                {setlist.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SetlistPicker;
