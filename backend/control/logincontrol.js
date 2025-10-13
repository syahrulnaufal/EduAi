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
      role: user.role,
      profile_image: user.profile_image
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
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']
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

// tambahan: update profil user (untuk profile page)
export const updateProfile = async (req, res) => {
  console.log('=== updateProfile called ===');
  console.log('Session user:', req.session.user);
  console.log('Request body keys:', Object.keys(req.body));
  console.log('Request body sizes:', {
    username: req.body.username?.length || 0,
    email: req.body.email?.length || 0,
    profileImage: req.body.profileImage?.length || 0
  });
  
  const userId = req.session.user.id;
  const { username, email, profileImage } = req.body;

  if (!username && !email && !profileImage) {
    console.log('No data to update');
    return res.status(400).json({ message: 'Tidak ada data untuk diupdate' });
  }

  try {
    const fields = [];
    const values = [];

    if (username) { 
      console.log('Adding username update:', username);
      fields.push('username = ?'); 
      values.push(username); 
    }
    if (email) { 
      console.log('Adding email update:', email);
      fields.push('email = ?'); 
      values.push(email); 
    }
    if (profileImage) { 
      console.log('Processing profile image, size:', profileImage.length);
      // Validate base64 image size (should be reasonable for database storage)
      if (profileImage.length > 5 * 1024 * 1024) { // 5MB limit for base64
        console.log('Image too large:', profileImage.length);
        return res.status(400).json({ message: 'Gambar terlalu besar. Maksimal 5MB setelah diproses.' });
      }
      fields.push('profile_image = ?'); 
      values.push(profileImage); 
    }

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id_user = ?`;
    console.log('Executing SQL:', sql.replace(/profile_image = \?/, 'profile_image = [BASE64_DATA]'));
    console.log('Values count:', values.length);
    
    console.log('About to execute query...');
    const [result] = await db.query(sql, values);
    console.log('Query executed successfully, affected rows:', result.affectedRows);

    if (result.affectedRows === 0) {
      console.log('No rows affected - user not found');
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // update session dengan data baru
    console.log('Fetching updated user data...');
    const [rows] = await db.query('SELECT id_user AS id, username, email, profile_image FROM users WHERE id_user = ?', [userId]);
    const updatedUser = rows[0];
    console.log('Updated user data fetched:', {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      hasProfileImage: !!updatedUser.profile_image
    });
    
    req.session.user = {
      ...req.session.user,
      username: updatedUser.username,
      email: updatedUser.email,
      profile_image: updatedUser.profile_image
    };

    console.log('Profile update completed successfully');
    return res.json({ message: 'Profile updated successfully', user: req.session.user });
  } catch (err) {
    console.error('=== updateProfile error ===');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    // Provide specific error messages based on error type
    if (err.code === 'ER_NET_PACKET_TOO_LARGE') {
      return res.status(413).json({ message: 'File gambar terlalu besar untuk server. Coba gunakan gambar yang lebih kecil.' });
    } else if (err.code === 'ER_DATA_TOO_LONG') {
      return res.status(413).json({ message: 'Data gambar terlalu panjang. Gunakan gambar dengan ukuran lebih kecil.' });
    } else if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
      return res.status(408).json({ message: 'Koneksi terputus. Coba lagi dengan gambar yang lebih kecil.' });
    }
    
    return res.status(500).json({ message: 'Server error: ' + (err.message || 'Unknown error') });
  }
};

// tambahan: update password untuk profile page
export const updateProfilePassword = async (req, res) => {
  const userId = req.session.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password dan new password harus diisi' });
  }

  try {
    const [rows] = await db.query('SELECT password FROM users WHERE id_user = ?', [userId]);
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
    await db.query('UPDATE users SET password = ? WHERE id_user = ?', [newHash, userId]);

    return res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('updateProfilePassword error:', err);
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
  deleteUser,
  updateProfile,
  updateProfilePassword
};
//