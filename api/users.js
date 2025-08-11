import express from "express";
 
const router = express.Router();

import { createUser, getUserByEmailAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";


///POST /register creates a new User with the provided credentials and sends a token.
router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Request body requires: username, password");
    }

    const hashed = hashedPassword(password);
    const user = await createUser(username, hashed);

    if (!user || !user.id) {
      return res.status(500).send("User creation failed.");
    }

    const token = createToken({ id: user.id });
    res.status(201).send(token);
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByEmailAndPassword(username, password);
 if (!username || !password) return res.status(400).send("Invalid username or password.");

    const token = createToken({ id: user.id });
    res.send(token);
  });

export default router;
