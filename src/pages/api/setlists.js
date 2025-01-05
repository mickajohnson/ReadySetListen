import axios from "axios";

export default async function handler(req, res) {
  const { artist } = req.query;

  if (!artist) {
    res.status(500).json({ error: "No Artist Specified" });
  }

  const response = await axios.get(
    `https://api.setlist.fm/rest/1.0/artist/${encodeURIComponent(
      artist
    )}/setlists`,
    {
      headers: {
        "x-api-key": process.env.SETLIST_FM_KEY,
        Accept: "application/json",
      },
    }
  );

  if (response.status === 503) {
    res.status(503).json({ error: "Servers Busy" });
  } else if (response.status === 200) {
    res.status(200).json({ setlists: response.data.setlist });
  } else {
    res.status(500).json({ error: "Server Error" });
  }
}
