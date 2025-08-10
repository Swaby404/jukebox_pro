import express from "express";
const router = express.Router();

import { getTracks, getTrackById } from "#db/queries/tracks";

router
.route("/").get(async (_unused, res) => {
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

export default router;
