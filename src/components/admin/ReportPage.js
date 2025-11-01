import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "../../App.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = "http://localhost:8000";

function ReportPage({ token }) {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [residents, setResidents] = useState([]);

  const [upcomingTrainingsFilter, setUpcomingTrainingsFilter] = useState(0);
  const [trainingTypeId, setTrainingTypeId] = useState(0);
  const [coachId, setCoachId] = useState(0);
  const [lowerTimeBorder, setLowerTimeBorder] = useState(null);
  const [upperTimeBorder, setUpperTimeBorder] = useState(null);
  const [residentId, setResidentId] = useState(0);

  const handleSaveReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/training_sessions/residents/${trainingTypeId}/${coachId}/${residentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      var trainingsData =
        upcomingTrainingsFilter == 1
          ? response.data.filter(
              (training) => new Date(training.start_time) > new Date()
            )
          : upcomingTrainingsFilter == 2
            ? response.data.filter(
                (training) => new Date(training.start_time) <= new Date()
              )
            : response.data;

      if (
        lowerTimeBorder != null &&
        upperTimeBorder != null &&
        new Date(lowerTimeBorder) >= new Date(upperTimeBorder)
      ) {
        alert("Внимание! Даты указаны некорректно!");
      } else {
        if (
          lowerTimeBorder != null &&
          upperTimeBorder != null &&
          new Date(lowerTimeBorder) < new Date(upperTimeBorder)
        ) {
          trainingsData = trainingsData.filter(
            (training) =>
              new Date(lowerTimeBorder) <= new Date(training.start_time) &&
              new Date(training.start_time) <= new Date(upperTimeBorder)
          );
        }

        if (!trainingsData || trainingsData.length === 0) {
          alert("Нет данных для сохранения.");
          return;
        }
        const formattedData = [];

        trainingsData.forEach((training) => {
          if (training.residents && training.residents.length > 0) {
            training.residents.forEach((resident) => {
              formattedData.push({
                "ID тренировки": training.id,
                "Тип тренировки": training.training_type,
                "Фамилия тренера": training.coach_surname,
                "Имя тренера": training.coach_name,
                "Начало тренировки": new Date(
                  training.start_time
                ).toLocaleString(),
                "Длительность (мин)": training.duration,
                "Свободные места": training.remaining_places,
                "Макс. вместимость": training.max_capacity,
                "ID резидента": resident.id,
                "Фамилия резидента": resident.surname,
                "Имя резидента": resident.name,
                "Email резидента": resident.email,
                "Телефон резидента": resident.phone,
                "Дата рождения резидента": new Date(
                  resident.birthdate
                ).toLocaleDateString(),
              });
            });
          } else {
            formattedData.push({
              "ID тренировки": training.id,
              "Тип тренировки": training.training_type,
              "Фамилия тренера": training.coach_surname,
              "Имя тренера": training.coach_name,
              "Начало тренировки": new Date(
                training.start_time
              ).toLocaleString(),
              "Длительность (мин)": training.duration,
              "Свободные места": training.remaining_places,
              "Макс. вместимость": training.max_capacity,
              "ID резидента": "",
              "Фамилия резидента": "",
              "Имя резидента": "",
              "Email резидента": "",
              "Телефон резидента": "",
              "Дата рождения резидента": "",
            });
          }
        });

        // 2. Создаем рабочий лист из данных
        const ws = XLSX.utils.json_to_sheet(formattedData);

        // 3. Создаем рабочую книгу (workbook) и добавляем лист
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Тренировки"); // "Тренировки" - название листа

        // 4. Генерируем XLSX файл в виде Blob
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/octet-stream" });

        // 5. Сохраняем файл
        const filename = `Отчет_Тренировки_${new Date().toISOString().slice(0, 10)}.xlsx`;
        saveAs(blob, filename);

        alert("Отчет успешно сохранен в формате XLSX!");
      }
    } catch (error) {
      console.error("Error fetching or saving trainings:", error);
      alert(
        "Не удалось загрузить или сохранить отчет. Проверьте консоль для деталей."
      );
    }
  };

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training_types/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainingTypes(response.data);
      } catch (error) {
        console.error("Error fetching training types:", error);
        alert("Failed to fetch training types. Check the console for details.");
      }
    };

    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/coaches/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoaches(response.data);
      } catch (error) {
        console.error("Error fetching training types:", error);
        alert("Failed to fetch training types. Check the console for details.");
      }
    };

    const fetchResidents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/residents/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResidents(response.data);
      } catch (error) {
        console.error("Error fetching residents:", error);
        alert("Failed to fetch residents. Check the console for details.");
      }
    };

    fetchTrainingTypes();
    fetchCoaches();
    fetchResidents();
  }, [token]);

  const handleTrainingTypeChange = (event) => {
    const selectedValue = event.target.value;
    setTrainingTypeId(selectedValue === "all" ? 0 : selectedValue);
  };

  const handleCoachChange = (event) => {
    const selectedValue = event.target.value;
    setCoachId(selectedValue === "all" ? 0 : selectedValue);
  };

  const handleResidentChange = (event) => {
    const selectedValue = event.target.value;
    setResidentId(selectedValue === "all" ? 0 : selectedValue);
  };

  const handleTrainingFilterChange = (event) => {
    const selectedValue = event.target.value;
    setUpcomingTrainingsFilter(selectedValue === "all" ? 0 : selectedValue);
  };

  return (
    <div>
      <h2 className="Chapter-title">Отчёт с параметрами</h2>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSaveReport}>
          <div className="Auth-form-content">
            <select
              className="Select-combobox"
              onChange={handleTrainingFilterChange}
              value={upcomingTrainingsFilter || "all"}
            >
              <option value="all">Все тренировки</option>
              <option value={1}>Предстоящие тренировки</option>
              <option value={2}>История тренировок</option>
            </select>
            <select
              className="Select-combobox"
              onChange={handleTrainingTypeChange}
              value={trainingTypeId || "all"}
            >
              <option value="all">Выберите вид тренировки</option>
              {trainingTypes.map((trainingType) => (
                <option key={trainingType.id} value={trainingType.id}>
                  {trainingType.training_name}
                </option>
              ))}
            </select>

            <select
              className="Select-combobox"
              onChange={handleCoachChange}
              value={coachId || "all"}
            >
              <option value="all">Выберите тренера</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.surname} {coach.name}
                </option>
              ))}
            </select>

            <div className="form-group mt-3">
              <label>Нижняя граница времени</label>
              <input
                type="datetime-local"
                className="form-control mt-1"
                placeholder="Введите время начала тренировки"
                value={lowerTimeBorder}
                onChange={(e) => setLowerTimeBorder(e.target.value)}
              />
            </div>

            <div className="form-group mt-3">
              <label>Верхняя граница времени</label>
              <input
                type="datetime-local"
                className="form-control mt-1"
                placeholder="Введите время начала тренировки"
                value={upperTimeBorder}
                onChange={(e) => setUpperTimeBorder(e.target.value)}
              />
            </div>

            <select
              className="Select-combobox"
              onChange={handleResidentChange}
              value={residentId || "all"}
            >
              <option value="all">Выберите резидента</option>
              {residents.map((resident) => (
                <option key={resident.id} value={resident.id}>
                  {resident.surname} {resident.name}
                </option>
              ))}
            </select>

            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Скачать отчёт
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportPage;
