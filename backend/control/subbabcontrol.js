import e from "express";
import db from "../db.js";

export const getSubbabByBab = async (req, res) => {
  try {
    const { id_bab } = req.query;

    if (!id_bab) {
      return res.status(400).json({ message: "id_bab wajib diisi" });
    }
    const [row] = await db.execute(
      "SELECT * FROM bab WHERE id_bab = ?",
      [id_bab]
    );
    if (row.length === 0) {
      return res.status(404).json({ message: "Bab tidak ditemukan" });
    }
    
    const [rows] = await db.execute(
      "SELECT * FROM subbab WHERE id_bab = ?",
      [row[0].id_bab]
    );
    res.json({ bab: row[0], subbab: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSubbab = async (req, res) => {
  try {
    const { id_subbab } = req.params;
    const { nama_subbab, deskripsi, video_url } = req.body;

    if (!id_subbab) {
      return res.status(400).json({ message: "id_subbab wajib diisi" });
    }

    const [result] = await db.execute(
      "UPDATE subbab SET nama_subbab = ?, deskripsi = ?, video_url = ? WHERE id_subbab = ?",
      [nama_subbab, deskripsi, video_url, id_subbab]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subbab tidak ditemukan" });
    }

    res.json({ message: "Subbab berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSubbab = async (req, res) => {
  try {
    const { id_subbab } = req.params;
    if (!id_subbab) {
      return res.status(400).json({ message: "id_subbab wajib diisi" });
    } 

    const [result] = await db.execute(
      "DELETE FROM subbab WHERE id_subbab = ?",[id_subbab]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subbab tidak ditemukan" });
    } 
    res.json({ message: "Subbab berhasil dihapus" });
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};

export default { getSubbabByBab, updateSubbab, deleteSubbab };