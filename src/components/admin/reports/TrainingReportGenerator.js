import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

// Импорты для Chart.js и react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "../../../App.css";

// Регистрация необходимых компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = "http://localhost:8000";

// Компонент, полностью на JavaScript
const TrainingReportGenerator = ({ token }) => {
  const [trainingTypesStatistics, setTrainingTypesStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/training_types/statistics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrainingTypesStatistics(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке статистики:", err);
        setError("Не удалось загрузить данные для отчета.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [API_BASE_URL, token]); // Зависимости useEffect

  const handleSaveCharts = async () => {
    if (!trainingTypesStatistics || trainingTypesStatistics.length === 0) {
      alert("Нет данных для сохранения диаграмм.");
      return;
    }

    try {
      // Сохранение столбчатой диаграммы
      if (barChartRef.current) {
        const barCanvas = await html2canvas(barChartRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        barCanvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, "столбчатая_диаграмма_тренировок.png");
          }
        });
      }

      // Сохранение круговой диаграммы
      if (pieChartRef.current) {
        const pieCanvas = await html2canvas(pieChartRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        pieCanvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, "круговая_диаграмма_тренировок.png");
          }
        });
      }

      alert("Диаграммы успешно сохранены как изображения!");
    } catch (err) {
      console.error("Ошибка при сохранении диаграмм:", err);
      alert("Произошла ошибка при сохранении диаграмм. Подробности в консоли.");
    }
  };

  if (loading) return <div>Загрузка данных для отчета...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (trainingTypesStatistics.length === 0)
    return <div>Нет данных для отображения отчета.</div>;

  // Подготовка данных для Chart.js
  const labels = trainingTypesStatistics.map((stat) => stat.training_name);
  const dataValues = trainingTypesStatistics.map(
    (stat) => stat.recorded_residents
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Зарегистрировано резидентов",
        data: dataValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(201, 203, 207, 0.6)", // Добавил ещё цвета, если данных больше
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Опции для столбчатой диаграммы
  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Популярность видов тренировок (Столбчатая диаграмма)",
        font: { size: 16 },
      },
      legend: {
        position: "top", // 'top' as const убрано, т.к. не нужен тип
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Количество резидентов",
        },
      },
      x: {
        title: {
          display: true,
          text: "Вид тренировки",
        },
      },
    },
  };

  // Опции для круговой диаграммы
  const pieOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Процентное соотношение популярности видов тренировок",
        font: { size: 16 },
      },
      legend: {
        position: "top", // 'top' as const убрано
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            // context без типа
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              const total = context.dataset.data.reduce(
                (sum, value) => sum + value,
                0
              );
              const value = context.parsed;
              const percentage = ((value / total) * 100).toFixed(2) + "%";
              label += value + " (" + percentage + ")";
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="Report-wrapper">
      <h2>Отчет по популярности видов тренировок</h2>

      <div style={{ marginBottom: "20px" }}>
        <button className="Select-button" onClick={handleSaveCharts}>
          Сохранить диаграммы как изображения (PNG)
        </button>
      </div>

      <div
        ref={barChartRef}
        style={{ width: "600px", height: "400px", marginBottom: "40px" }}
      >
        <Bar options={barOptions} data={chartData} />
      </div>

      <div ref={pieChartRef} style={{ width: "400px", height: "400px" }}>
        <Pie options={pieOptions} data={chartData} />
      </div>
    </div>
  );
};

export default TrainingReportGenerator;
