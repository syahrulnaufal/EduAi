import db from '../db.js';

export const getAllpelajaran = (req, res) => {
  db.query('SELECT * FROM pelajaran', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const addpelajaran = (req, res) => {
  const { nama_pelajaran } = req.body;
  db.query('INSERT INTO pelajaran (nama_pelajaran) VALUES (?)', [nama_pelajaran], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'pelajaran ditambahkan', id: result.insertId });
  });
};

export const updatepelajaran = (req, res) => {
  const { id } = req.params;
  const { nama_pelajaran } = req.body;
  db.query('UPDATE pelajaran SET nama_pelajaran = ? WHERE id_pelajaran = ?', [nama_pelajaran, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'pelajaran diupdate' });
  });
};

export const deletepelajaran = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM pelajaran WHERE id_pelajaran = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'pelajaran dihapus' });
  });
};
