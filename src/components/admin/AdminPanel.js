import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "../../App.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import AddTrainingSession from "./training_session/AddTrainingSession";
import AddTrainingType from "./training_type/AddTrainingType";
import AddCoach from "./coach/AddCoach";
import AddPost from "./posts/AddPost";

import InfoTrainings from "./training_session/InfoTrainings";
import InfoTrainingTypes from "./training_type/InfoTrainingTypes";
import InfoCoaches from "./coach/InfoCoaches";
import InfoPosts from "./posts/InfoPosts";

import EditTraining from "./training_session/EditTraining";
import EditTrainingType from "./training_type/EditTrainingType";
import EditCoach from "./coach/EditCoach";
import EditPost from "./posts/EditPost";

const API_BASE_URL = "http://localhost:8000";

function AdminPanel({ token }) {
  const [activeTab, setActiveTab] = useState("infoTrainings");
  const [editSthId, setEditSthId] = useState(0);

  const [isTrainingSessionsDropdownOpen, setIsTrainingSessionsDropdownOpen] = useState(false);
  const [isTrainingTypesDropdownOpen, setIsTrainingTypesDropdownOpen] = useState(false);
  const [isCoachesDropdownOpen, setIsCoachesDropdownOpen] = useState(false);
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);

  const toggleTrainingSessionsDropdown = () => { setIsTrainingSessionsDropdownOpen(true); };
  const toggleTrainingTypesDropdown = () => { setIsTrainingTypesDropdownOpen(true); };
  const toggleCoachesDropdown = () => { setIsCoachesDropdownOpen(true); };
  const toggleNewsDropdown = () => { setIsNewsDropdownOpen(true); };
  const toggleReportsDropdown = () => { setIsReportsDropdownOpen(true); };

  const closeTrainingSessionsDropdown = () => { setIsTrainingSessionsDropdownOpen(false); };
  const closeTrainingTypesDropdown = () => { setIsTrainingTypesDropdownOpen(false); };
  const closeCoachesDropdown = () => { setIsCoachesDropdownOpen(false); };
  const closeNewsDropdown = () => { setIsNewsDropdownOpen(false); };
  const closeReportsDropdown = () => { setIsReportsDropdownOpen(false); };

  // Заглушка
  const handleSelection = (reportType) => {
    setIsTrainingSessionsDropdownOpen(false);
    setIsTrainingTypesDropdownOpen(false);
    setIsCoachesDropdownOpen(false);
    setIsNewsDropdownOpen(false);
    setIsReportsDropdownOpen(false);
  };
  //

  // Логика для изменения записей
  const handleEditTraining = (trainingId) => {
    setEditSthId(trainingId);
    setActiveTab("editTraining");
  }

  const handleEditTrainingType = (trainingTypeId) => {
    setEditSthId(trainingTypeId);
    setActiveTab("editTrainingType");
  }

  const handleEditCoach = (coachId) => {
    setEditSthId(coachId);
    setActiveTab("editCoach");
  }

  const handleEditPost = (postId) => {
    setEditSthId(postId);
    setActiveTab("editPost");
  }

  const saveTrainings = async (upcomingTrainingsFilter) => {
    setIsReportsDropdownOpen(false);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/training_sessions/residents/0/0`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const trainingsData = 
            upcomingTrainingsFilter == 1
          ? response.data.filter(
              (training) => new Date(training.start_time) <= new Date()
            )
          : upcomingTrainingsFilter == 2
            ? response.data.filter(
                (training) => new Date(training.start_time) > new Date()
              )
            : response.data;

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
            "Начало тренировки": new Date(training.start_time).toLocaleString(),
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
    } catch (error) {
      console.error("Error fetching or saving trainings:", error);
      alert(
        "Не удалось загрузить или сохранить отчет. Проверьте консоль для деталей."
      );
    }
  };

  return (
    <div className="Dashboard">
      <nav className="Dashboard-nav">
        <ul className="Dashboard-nav-list">
          <li
            className={activeTab === "trainings" ? "active" : ""}
            onMouseEnter={toggleTrainingSessionsDropdown}
            onMouseLeave={closeTrainingSessionsDropdown}
          >
            <button>Тренировки</button>
            {isTrainingSessionsDropdownOpen && (
              <ul className="dropdown-menu">
                <li className={activeTab === "addTrainingSession" ? "active" : ""}>
                  <button onClick={() => setActiveTab("addTrainingSession")}>
                    Добавить тренировку
                  </button>
                </li>
                <li className={activeTab === "infoTrainings" ? "active" : ""}>
                  <button onClick={() => setActiveTab("infoTrainings")}>
                    Изменить тренировки
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li
            className={activeTab === "trainingTypes" ? "active" : ""}
            onMouseEnter={toggleTrainingTypesDropdown}
            onMouseLeave={closeTrainingTypesDropdown}
          >
            <button>Виды тренировок</button>
            {isTrainingTypesDropdownOpen && (
              <ul className="dropdown-menu">
                <li className={activeTab === "addTrainingType" ? "active" : ""}>
                  <button onClick={() => setActiveTab("addTrainingType")}>
                    Добавить вид тренировки
                  </button>
                </li>
                <li className={activeTab === "infoTrainingTypes" ? "active" : ""}>
                  <button onClick={() => setActiveTab("infoTrainingTypes")}>
                    Изменить вид тренировки
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li
            className={activeTab === "trainingTypes" ? "active" : ""}
            onMouseEnter={toggleCoachesDropdown}
            onMouseLeave={closeCoachesDropdown}
          >
            <button>Тренеры</button>
            {isCoachesDropdownOpen && (
              <ul className="dropdown-menu">
                <li className={activeTab === "addCoach" ? "active" : ""}>
                  <button onClick={() => setActiveTab("addCoach")}>
                    Добавить тренера
                  </button>
                </li>
                <li className={activeTab === "infoCoaches" ? "active" : ""}>
                  <button onClick={() => setActiveTab("infoCoaches")}>
                    Изменить тренера
                  </button>
                </li>
              </ul>
            )}
          </li>

          <li
            className={activeTab === "trainingTypes" ? "active" : ""}
            onMouseEnter={toggleNewsDropdown}
            onMouseLeave={closeNewsDropdown}
          >
            <button>Новости</button>
            {isNewsDropdownOpen && (
              <ul className="dropdown-menu">
                <li className={activeTab === "addPost" ? "active" : ""}>
                  <button onClick={() => setActiveTab("addPost")}>
                    Добавить новость
                  </button>
                </li>
                <li className={activeTab === "infoPosts" ? "active" : ""}>
                  <button onClick={() => setActiveTab("infoPosts")}>
                    Изменить новость
                  </button>
                </li>
              </ul>
            )}
          </li>


          {/* <li className={activeTab === "trainingsInfo" ? "active" : "Dashboard-nav-list-item"}>
            <button onClick={() => setActiveTab("trainingsInfo")}>
              Тренировки
            </button>
          </li>
          <li className={activeTab === "addCoach" ? "active" : ""}>
            <button onClick={() => setActiveTab("addCoach")}>+ Тренер</button>
          </li>
          <li className={activeTab === "addTrainingType" ? "active" : ""}>
            <button onClick={() => setActiveTab("addTrainingType")}>
              +Вид тренировки
            </button>
          </li>
          <li className={activeTab === "addTrainingSession" ? "active" : ""}>
            <button onClick={() => setActiveTab("addTrainingSession")}>
              +Тренировка
            </button>
          </li>
          <li className={activeTab === "addPost" ? "active" : ""}>
            <button onClick={() => setActiveTab("addPost")}>+Новость</button>
          </li> */}


          <li
            className={activeTab === "reports" ? "active" : ""}
            onMouseEnter={toggleReportsDropdown}
            onMouseLeave={closeReportsDropdown}
          >
            <button>Отчеты</button>
            {isReportsDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <button onClick={() => saveTrainings(0)}>
                    Все тренировки
                  </button>
                </li>
                <li>
                  <button onClick={() => saveTrainings(1)}>
                    Прошедшие тренировки
                  </button>
                </li>
                <li>
                  <button onClick={() => saveTrainings(2)}>
                    Предстоящие тренировки
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <div className="Dashboard-content">      
        {activeTab === "addTrainingSession" && (<AddTrainingSession token={token} />)}
        {activeTab === "addTrainingType" && <AddTrainingType token={token} />}
        {activeTab === "addCoach" && <AddCoach token={token} />}
        {activeTab === "addPost" && <AddPost token={token} />}

        {activeTab === "infoTrainings" && <InfoTrainings token={token} handleEditTraining={handleEditTraining} />}
        {activeTab === "infoCoaches" && <InfoCoaches token={token} handleEditCoach={handleEditCoach} />}
        {activeTab === "infoPosts" && <InfoPosts token={token} handleEditPost={handleEditPost} />}
        {activeTab === "infoTrainingTypes" && <InfoTrainingTypes token={token} handleEditTrainingType={handleEditTrainingType} />}

        {activeTab === "editTraining" && <EditTraining token={token} trainingId={editSthId} setActiveTab={setActiveTab} />}
        {activeTab === "editTrainingType" && <EditTrainingType token={token} trainingTypeId={editSthId} setActiveTab={setActiveTab} />}
        {activeTab === "editCoach" && <EditCoach token={token} coachId={editSthId} setActiveTab={setActiveTab} />}
        {activeTab === "editPost" && <EditPost token={token} postId={editSthId} setActiveTab={setActiveTab} />}

      </div>
    </div>
  );
}

export default AdminPanel;
