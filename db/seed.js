///Update the seed file to additionally seed at least 2 users. 
// Each user should have a playlist containing at least 5 tracks. 
// You will have to edit how playlists are seeded as well, 
// since they now are required to belong to a user!

import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createTrack } from "#db/queries/tracks";
 
import { createPlaylistTrack } from "#db/queries/playlists_tracks";

import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create two users
  const user1 = await createUser("heartseeker@lo.ve", "cupid123");
  const user2 = await createUser("druid@forest.tree", "bear!");

  // Create playlists for each user and add 5 tracks to each playlist
  const user1Playlist = await createPlaylist("Heartseeker's Playlist", "Playlist for heartseeker", user1.id);
  for (let i = 1; i <= 5; i++) {
    const track = await createTrack(`Heartseeker Track ${i}`, i * 10000);
    await createPlaylistTrack(user1Playlist.id, track.id);
  }

  const user2Playlist = await createPlaylist("Druid's Playlist", "Playlist for druid", user2.id);
  for (let i = 1; i <= 5; i++) {
    const track = await createTrack(`Druid Track ${i}`, i * 20000);
    await createPlaylistTrack(user2Playlist.id, track.id);
  }

  // Seed generic playlists and tracks (without user)
  for (let i = 1; i <= 20; i++) {
    await createPlaylist("Playlist " + i, "lorem ipsum playlist description");
    await createTrack("Track " + i, i * 50000);
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(i / 2);
    await createPlaylistTrack(playlistId, i);
  }
}



  
 