import db from '../db.js';
import argon2 from 'argon2';

// ...existing code...
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    const user = rows[0];

    // guard: pastikan hash ada
    if (!user.password) {
      console.error('No password hash for user:', user);
      return res.status(500).json({ message: 'Server error' });
    }

    // verify hashed password with argon2 (handle errors)
    let passwordOk = false;
    try {
      passwordOk = await argon2.verify(user.password, password);
    } catch (err) {
      console.error('argon2.verify error:', err);
      return res.status(500).json({ message: 'Error verifying password' });
    }

    if (!passwordOk) {
      return res.status(401).json({ message: 'Password salah' });
    }

    req.session.user = {
  id: user.id_user,
  username: user.username,
  email: user.email,
  role: user.role
};
      return res.json({
  message: 'Login berhasil!',
  user: req.session.user
    });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const signinUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, dan kata sandi harus diisi' });
  }

  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // hash password before storing
    const hashedPassword = await argon2.hash(password);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    return res.status(201).json({ message: 'User berhasil ditambahkan', id: result.insertId });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

// tambahan: dapatkan satu user berdasarkan id
export const getUserById = async (req, res) => {
  // "id" bisa berupa id_user (angka) ATAU username ATAU email
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id_user AS id, username, email FROM users WHERE id_user = ? OR username = ? OR email = ? LIMIT 1',
      [id, id, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// tambahan: list semua user (untuk admin)
export const listUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_user AS id, username, email FROM users ORDER BY id_user DESC');
    return res.json(rows);
  } catch (err) {
    console.error('listUsers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// tambahan: update profil user (username/email)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  if (!username && !email) {
    return res.status(400).json({ message: 'Tidak ada data untuk diupdate' });
  }

  try {
    const fields = [];
    const values = [];

    if (username) { fields.push('username = ?'); values.push(username); }
    if (email) { fields.push('email = ?'); values.push(email); }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id_user = ?`;
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

    // kembalikan data terbaru
    const [rows] = await db.query('SELECT id_user AS id, username, email FROM users WHERE id_user = ?', [id]);
    return res.json({ message: 'User updated', user: rows[0] });
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// tambahan: ganti password
export const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password required' });
  }

  try {
    const [rows] = await db.query('SELECT password FROM users WHERE id_user = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

    const hash = rows[0].password;
    let ok = false;
    try {
      ok = await argon2.verify(hash, currentPassword);
    } catch (err) {
      console.error('argon2.verify error:', err);
      return res.status(500).json({ message: 'Error verifying password' });
    }

    if (!ok) return res.status(401).json({ message: 'Password lama salah' });

    const newHash = await argon2.hash(newPassword);
    await db.query('UPDATE users SET password = ? WHERE id_user = ?', [newHash, id]);

    return res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('updatePassword error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// tambahan: hapus user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM users WHERE id_user = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    return res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  loginUser,
  signinUser,
  getUserById,
  listUsers,
  updateUser,
  updatePassword,
  deleteUser
};
//