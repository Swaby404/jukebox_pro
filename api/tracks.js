import express from "express";
const router = express.Router();
export default router;


import { getTracks, getTrackById,  } from "#db/queries/tracks";
import { getPlaylistsById } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";


///GET /tracks/:id/playlists sends all playlists owned by the user that contain this track.

router
.route("/").get(async (req, res) => {
  try {
    const tracks = await getTracks();
    res.send(tracks);
  } catch (err) {
    res.status(500).send("Server error.");
  }
});


router.route("/:id").get(async (req, res) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).send("Track not found.");
    res.send(track);
  } catch (err) {
    res.status(500).send("Server error.");
  }
});

 

 
