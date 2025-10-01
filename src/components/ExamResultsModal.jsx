import React, { useEffect, useState } from "react";

function ExamResultsModal({ id_hasil, onClose, onReview }) {
  const [hasil, setHasil] = useState(null);

  useEffect(() => {
    if (!id_hasil) return;
    fetch(`http://localhost:5000/api/hasil/${id_hasil}`)
      .then(res => res.json())
      .then(data => setHasil(data))
      .catch(err => console.error("ERROR fetch hasil:", err));
  }, [id_hasil]);

  if (!hasil) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">Memuat hasil...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">HASIL</h2>

        <p className="text-5xl font-bold text-gray-700">
          {hasil.benar} / {hasil.total}
        </p>
        <p className="text-2xl font-semibold text-gray-600 mb-2">BENAR</p>

        <div className="flex justify-center space-x-6 mb-6">
          <div className="text-green-600 font-bold">✔ {hasil.benar} Benar</div>
          <div className="text-red-600 font-bold">✘ {hasil.salah} Salah</div>
          <div className="text-blue-600 font-bold">Σ {hasil.total} Soal</div>
        </div>

        <div className="text-xl font-bold text-gray-700 mb-8">
          Skor {hasil.score}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onReview}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors"
          >
            Pembahasan
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamResultsModal;
