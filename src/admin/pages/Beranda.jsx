import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Warna untuk Pie Chart
const COLORS = ["#6366f1"];

const periodeOptions = [
  { value: "minggu", label: "Minggu ini" },
  { value: "bulan", label: "Bulan ini" },
  { value: "tahun", label: "Tahun ini" },
];

export default function Beranda() {
  const [periode, setPeriode] = useState(periodeOptions[0]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPelajaran: 0,
    totalSubbab: 0,
    totalSoal: 0,
    pembelian: [],
    guru: [],
  });

  // Ambil data dashboard
  const getDashboard = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/dashboard?periode=${periode.value}`
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetch dashboard:", err);
    }
  };

  useEffect(() => {
    getDashboard();
  }, [periode]);

  return (
    <div className="p-6">
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="w-44">
          <Select
            options={periodeOptions}
            value={periode}
            onChange={setPeriode}
            placeholder="Filter Periode"
          />
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 min-h-[120px] py-8">
          <div className="bg-purple-200 p-6 rounded-full">
            <i className="fa-solid fa-users text-purple-600 text-2xl"></i>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-gray-600">Users</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 min-h-[120px] py-8">
          <div className="bg-purple-200 p-6 rounded-full">
            <i className="fa-solid fa-book text-purple-600 text-2xl"></i>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalPelajaran}</div>
            <div className="text-gray-600">Pelajaran</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 min-h-[120px] py-8">
          <div className="bg-purple-200 p-6 rounded-full">
            <i className="fa-solid fa-layer-group text-purple-600 text-2xl"></i>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalSubbab}</div>
            <div className="text-gray-600">Subbab</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 min-h-[120px] py-8">
          <div className="bg-purple-200 p-6 rounded-full">
            <i className="fa-solid fa-question text-purple-600 text-2xl"></i>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalSoal}</div>
            <div className="text-gray-600">Soal</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">Pembelian</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.pembelian}>
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
              <XAxis dataKey="hari" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">Guru</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.guru}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {stats.guru.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
