import db from '../db.js';

export const getAllJenjang = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jenjang');
    return res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

export const addJenjang = async (req, res) => {
  const { nama_jenjang } = req.body;

  if (!nama_jenjang) {
    return res.status(400).json({ message: 'Nama jenjang harus diisi' });
  }

  try {
    const [result] = await db.query('INSERT INTO jenjang (nama_jenjang) VALUES (?)', [nama_jenjang]);
    return res.status(201).json({ message: 'Jenjang ditambahkan', id: result.insertId });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

export const updateJenjang = async (req, res) => {
  const { id } = req.params;
  const { nama_jenjang } = req.body;

  if (!nama_jenjang) {
    return res.status(400).json({ message: 'Nama jenjang harus diisi' });
  }

  try {
    const [result] = await db.query('UPDATE jenjang SET nama_jenjang = ? WHERE id_jenjang = ?', [nama_jenjang, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jenjang tidak ditemukan' });
    }
    return res.json({ message: 'Jenjang diupdate' });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

export const deleteJenjang = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM jenjang WHERE id_jenjang = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jenjang tidak ditemukan' });
    }
    return res.json({ message: 'Jenjang dihapus' });
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
};

export default { getAllJenjang, addJenjang, updateJenjang, deleteJenjang };