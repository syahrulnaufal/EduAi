import db from '../db.js';


export const getMateriByJenjang = async (req, res) => {
    const { jenjang } = req.query;
    if (!jenjang) {
        return res.status(400).json({ message: 'Jenjang is required' });
    }
    try {
        const [rows] = await db.execute(
            'SELECT * FROM pelajaran WHERE id_jenjang = ?',
            [jenjang]
        );

        const formatted = rows.map(row => ({
            id: row.id_pelajaran,
            label: row.nama_pelajaran,
            ikon: row.icon,
            link: row.link
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export default { getMateriByJenjang };