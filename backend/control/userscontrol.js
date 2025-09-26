import db from "../db.js";
import argon2 from "argon2";

// Get All Users
export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id_user, username, email, role FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id_user, username, email, role FROM users WHERE id_user=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create User
export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hash = await argon2.hash(password);
    await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hash, role]
    );
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let hashPassword;
    if (password) {
      hashPassword = await argon2.hash(password);
      await db.query(
        "UPDATE users SET username=?, email=?, password=?, role=? WHERE id_user=?",
        [username, email, hashPassword, role, req.params.id]
      );
    } else {
      await db.query(
        "UPDATE users SET username=?, email=?, role=? WHERE id_user=?",
        [username, email, role, req.params.id]
      );
    }
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id_user=?", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
