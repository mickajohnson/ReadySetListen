function averageSetLength(sets) {
  let avg = 0;
  const buffer = 2;
  for (let i = 0; i < sets.length; i++) {
    if (Array.isArray(sets[i].set)) {
      avg += sets[i].set.length;
    }
  }
  avg /= sets.length;
  return Math.ceil(avg) + buffer;
}

export function setlistSorter(setlistData) {
  const averages = { songs: [], avgLength: 0 };
  let sortedSetlist = setlistData.filter(
    (setlist) =>
      typeof setlist.sets.set === "object" || Array.isArray(setlist.sets.set)
  );
  if (sortedSetlist.length === 0) {
    return false;
  }
  sortedSetlist = sortedSetlist
    .map((setlist) => {
      const concert = {
        id: setlist.id,
        artist: setlist.artist["name"],
        set: [],
        title: `${setlist["eventDate"]} - ${setlist.venue.city["name"]} - ${setlist.venue.city["stateCode"]}`,
      };
      if (Array.isArray(setlist.sets.set)) {
        if (setlist.sets.set.length < 1) {
          return null;
        }
        for (let i = 0; i < setlist.sets.set.length; i++) {
          concert.set = concert.set.concat(setlist.sets.set[i].song);
        }
      } else if (typeof setlist.sets.set === "object") {
        concert.set = setlist.sets.set.song;
      }
      for (let i = 0; i < concert.set.length; i++) {
        const found = averages.songs.findIndex((song) => {
          return song["name"] === concert.set[i]["name"];
        });
        if (found !== -1) {
          averages.songs[found].occurrence += 1;
          averages.songs[found].avgPlace.push(i);
        } else {
          concert.set[i].occurrence = 1;
          concert.set[i].avgPlace = [i];
          averages.songs.push(concert.set[i]);
        }
      }
      return concert;
    })
    .filter((concert) => concert);
  const averageSet = calcTypicalSet(averages, sortedSetlist);
  sortedSetlist.unshift({
    id: "avg",
    set: averageSet,
    title: `A Typical Recent ${sortedSetlist[1].artist} Set`,
    artist: sortedSetlist[1].artist,
  });
  return sortedSetlist;
}

function calcTypicalSet(averages, setlists) {
  averages.avgLength = averageSetLength(setlists);
  averages.songs.sort((a, b) => {
    if (a.occurrence < b.occurrence) {
      return 1;
    }
    if (a.occurrence > b.occurrence) {
      return -1;
    }
    return 0;
  });
  let averageSet = averages.songs.slice(0, averages.avgLength);
  averageSet = averageSet.map((song) => {
    song.avgPlace = song.avgPlace.reduce((total, place) => {
      return total + place;
    });
    song.avgPlace /= song.occurrence;
    return song;
  });
  averageSet.sort((a, b) => {
    if (a.avgPlace > b.avgPlace) {
      return 1;
    }
    if (a.avgPlace < b.avgPlace) {
      return -1;
    }
    return 0;
  });
  return averageSet;
}
