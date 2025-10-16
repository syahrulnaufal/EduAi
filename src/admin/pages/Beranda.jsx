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

const COLORS = ["#6366f1", "#a5b4fc", "#c7d2fe"];

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
    <div className="p-1 sm:p-6 bg-gray-50 min-h-[calc(100vh-80px)] text-xs sm:text-base">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="w-full sm:w-44">
          <Select
            options={periodeOptions}
            value={periode}
            onChange={setPeriode}
            placeholder="Filter Periode"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#e5e7eb",
                boxShadow: "none",
              }),
            }}
          />
        </div>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: "fa-users", label: "Users", value: stats.totalUsers },
          { icon: "fa-book", label: "Pelajaran", value: stats.totalPelajaran },
          { icon: "fa-layer-group", label: "Subbab", value: stats.totalSubbab },
          { icon: "fa-question", label: "Soal", value: stats.totalSoal },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-center gap-4 hover:shadow-md transition"
          >
            <div className="bg-indigo-100 p-4 rounded-full">
              <i className={`fa-solid ${item.icon} text-indigo-600 text-2xl`}></i>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-800">
                {item.value}
              </div>
              <div className="text-gray-600 text-sm sm:text-base">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-gray-800 text-lg">
            Pembelian
          </h3>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
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
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-gray-800 text-lg">Guru</h3>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.guru}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name }) => name}
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
    </div>
  );
}
