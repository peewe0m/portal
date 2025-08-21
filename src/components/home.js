// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import './home.css';
import { FaUser, FaUserTimes, FaClock, FaCheckCircle, FaUsers } from 'react-icons/fa';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartDataLabels
);

const Home = () => {
  const [stats, setStats] = useState({
    employees: 0,
    absent: 0,
    late: 0,
    present: 0,
    totalUsers: 0,
    workingDays: 0,
  });

  const [employees, setEmployees] = useState([]);
  const [showEmployeeGrid, setShowEmployeeGrid] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://sql12.freesqldatabase.com:3306/api/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://sql12.freesqldatabase.com:3306/api/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchStats();
    fetchEmployees();
  }, []);

  const cards = [
    {
      title: 'Employees',
      value: stats.employees,
      icon: <FaUsers />,
      onClick: () => setShowEmployeeGrid(!showEmployeeGrid),
    },
    { title: 'Absent', value: stats.absent, icon: <FaUserTimes /> },
    { title: 'Late', value: stats.late, icon: <FaClock /> },
    { title: 'Present', value: stats.present, icon: <FaCheckCircle /> },
    { title: 'Official Business', value: stats.totalUsers, icon: <FaUser /> },
  ];

  const attendancePercent = stats.employees > 0 ? (stats.present / stats.employees) * 100 : 0;

  const lineData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Attendance This Week (%)',
        data: Array(7).fill(Math.min(attendancePercent, 100)),
        fill: true,
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#bbbbbb' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: '#bbbbbb',
          callback: (value) => value + '%',
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  const pieOptions = {
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
      },
    },
  };

  const createPieData = (label, value) => ({
    labels: [label, 'Others'],
    datasets: [
      {
        data: [value, Math.max(stats.employees - value, 0)],
        backgroundColor: ['#ffffff', 'rgba(30, 30, 30, 0.65)'],
        borderWidth: 0,
      },
    ],
  });

  return (
    <div className="home-dashboard-wrapper">
      <div className="home-dashboard">
        {cards.map((card, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={card.onClick}
            style={{ cursor: card.onClick ? 'pointer' : 'default' }}
          >
            <div className="icon">{card.icon}</div>
            <div className="info">
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {showEmployeeGrid && (
        <div className="employee-grid">
          {employees.map((emp, idx) => (
            <div className="employee-box" key={idx}>
              <img
                src={`/${emp.name}.jpg`}
                alt={emp.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default.jpg'; // fallback image
                }}
              />
              <p>{emp.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Donut Charts */}
      <div className="pie-charts">
        <div className="pie-chart-box">
          <h4>Present</h4>
          <Pie data={createPieData('Present', stats.present)} options={pieOptions} />
        </div>
        <div className="pie-chart-box">
          <h4>Absent</h4>
          <Pie data={createPieData('Absent', stats.absent)} options={pieOptions} />
        </div>
        <div className="pie-chart-box">
          <h4>Late</h4>
          <Pie data={createPieData('Late', stats.late)} options={pieOptions} />
        </div>
        <div className="pie-chart-box">
          <h4>Official Business</h4>
          <Pie data={createPieData('Official Business', stats.totalUsers)} options={pieOptions} />
        </div>
      </div>

      {/* Line Chart */}
      <div className="chart-container">
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
};

export default Home;
