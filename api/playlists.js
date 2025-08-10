/*
 /playlists routes now require the user to be logged in.
GET /playlists sends array of all playlists owned by the user.
POST /playlists creates a new playlist owned by the user.
GET /playlists/:id sends 403 error if the user does not own the playlist.
GET /playlists/:id/tracks sends 403 error if the user does not own the playlist.
 */

import express from "express";
const router = express.Router();

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
  getTracksByPlaylistId,
  
  
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";




 
//All /playlists routes now require the user to be logged in.
router
  .route("/")
  //GET /playlists sends array of all playlists owned by the user
  .get(requireUser, async (req, res) => {

    const playlists = await getPlaylists(req.user.id);
    res.send(playlists);
  })
  .post(requireUser, async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");
 ///POST /playlists creates a new playlist owned by the user.
    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).send("Request body requires: name, description");

    const playlist = await createPlaylist(req.user.id, name, description);
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.route("/:id").get((req, res) => {
  res.send(req.playlist);
});
///GET /playlists/:id sends 403 error if the user does not own the playlist.
router
  .route("/:id/tracks")
  .get(requireUser, async (req, res) => {
    if (req.playlist.user_id !== req.user.id) {
      return res.status(403).send("Forbidden: You do not own this playlist.");
    }
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Request body requires: trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });

export default router;
