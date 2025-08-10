import bcrypt from "bcrypt";
import db from "../client.js";

export async function createUser(username, password_hash) {
  const sql = `
  INSERT INTO users
    (username, password_hash)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password_hash, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserByEmailAndPassword(username, password_hash) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const { rows } = await db.query(sql, [username]);
  const user = rows[0];
  if (!user) return null;

  const isValid = await bcrypt.compare(password_hash, user.password_hash);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const { rows } = await db.query(sql, [id]);
  const user = rows[0];
  return user;
}
