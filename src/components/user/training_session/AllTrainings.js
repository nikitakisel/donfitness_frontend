import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../App.css";

const API_BASE_URL = "http://localhost:8000";

function AllTrainings({ token }) {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [coaches, setCoaches] = useState([]);

  const [selectedTrainingTypeId, setSelectedTrainingTypeId] = useState(0);
  const [selectedCoachId, setSelectedCoachId] = useState(0);
  const [upcomingTrainingsFilter, setUpcomingTrainingsFilter] = useState(0);

  const [allTrainings, setAllTrainings] = useState([]);
  const [residentId, setResidentId] = useState(null);

  useEffect(() => {
    const fetchAllTrainings = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/training_sessions/not_enrolled/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllTrainings(response.data);
      } catch (error) {
        console.error("Error fetching all trainings:", error);
        alert("Failed to fetch all trainings. Check the console for details.");
      }
    };

    const fetchResidentId = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = response.data.id;
        const residentResponse = await axios.get(
          `${API_BASE_URL}/residents/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setResidentId(residentResponse.data.id);
      } catch (error) {
        console.error("Error fetching resident ID:", error);
        alert("Failed to fetch resident ID. Check the console for details.");
      }
    };

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
        console.error("Error fetching coaches:", error);
        alert("Failed to fetch coachess. Check the console for details.");
      }
    };

    fetchAllTrainings();
    fetchResidentId();
    fetchTrainingTypes();
    fetchCoaches();
  }, [token]);

  const handleEnroll = async (trainingSessionId) => {
    try {
      if (!residentId) {
        console.error("Resident ID is not available.");
        alert("Resident ID is not available. Please try again.");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/resident_to_training/`,
        {
          resident_id: residentId,
          training_session_id: trainingSessionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //Optimistically update the UI
      setAllTrainings(
        allTrainings.filter((training) => training.id !== trainingSessionId)
      );
      alert("Successfully enrolled!");
    } catch (error) {
      console.error("Error enrolling in training:", error);
      alert("Failed to enroll in training. Check the console for details.");
    }
  };

  const handleTrainingTypeChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTrainingTypeId(selectedValue === "all" ? 0 : selectedValue);
  };

  const handleCoachChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCoachId(selectedValue === "all" ? 0 : selectedValue);
  };

  const handleTrainingFilterChange = (event) => {
    const selectedValue = event.target.value;
    setUpcomingTrainingsFilter(selectedValue === "all" ? 0 : selectedValue);
  };

  const handleTrainingFilter = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/training_sessions/not_enrolled/${selectedTrainingTypeId}/${selectedCoachId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      var trainingList = response.data;
      setAllTrainings(
        upcomingTrainingsFilter == 1
          ? trainingList.filter(
              (training) => new Date(training.start_time) > new Date()
            )
          : upcomingTrainingsFilter == 2
            ? trainingList.filter(
                (training) => new Date(training.start_time) <= new Date()
              )
            : trainingList
      );
    } catch (error) {
      console.error("Error filter trainings:", error);
      alert("Failed to filter trainings. Check the console for details.");
    }
  };

  return (
    <div>
      <h2 className="Chapter-title">Все тренировки</h2>
      <div className="Select-wrapper">
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
          value={selectedTrainingTypeId || "all"}
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
          value={selectedCoachId || "all"}
        >
          <option value="all">Выберите тренера</option>
          {coaches.map((coach) => (
            <option key={coach.id} value={coach.id}>
              {coach.surname} {coach.name}
            </option>
          ))}
        </select>
        <button
          className="Select-button"
          onClick={() => handleTrainingFilter()}
        >
          Применить фильтр
        </button>
      </div>
      {allTrainings.length > 0 ? (
        <div className="Training-wrapper">
          <div className="Training-list">
            {allTrainings.map((training) => (
              <div key={training.id} className="Training-item">
                <div className="Training-fields Training-fields-all-trainings"></div>
                <div className="Training-info">
                  <h3>{training.training_type}</h3>
                  <p>
                    {training.coach_name} {training.coach_surname}
                  </p>
                  <p>
                    {new Date(training.start_time).toLocaleString()} (
                    {training.duration} минут)
                  </p>
                  <p>
                    Свободно мест: {training.remaining_places} из{" "}
                    {training.max_capacity}
                  </p>
                  {new Date(training.start_time) > new Date() ? (
                    training.remaining_places > 0 ? (
                      <button className="Training-info-button" onClick={() => handleEnroll(training.id)}>
                        Записаться
                      </button>
                    ) : (
                      <p>Увы, все места заняты :(</p>
                    )
                  ) : (
                    <p>Статус: проведено</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Тренировок по запросу не найдено.</p>
      )}
    </div>
  );
}

export default AllTrainings;
