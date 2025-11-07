import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../App.css";

const API_BASE_URL = "http://localhost:8000";

// Переименованный компонент для отображения информации о достижениях
function InfoAchievements({ token, handleEditAchievement }) { // Изменены пропсы
  const [achievements, setAchievements] = useState([]); // Изменено состояние

  const handleDeleteAchievement = async (achievementId) => { // Изменена функция
    if (!window.confirm("Вы уверены, что хотите удалить это достижение?")) {
      return; // Отмена удаления, если пользователь не подтвердил
    }

    try {
      await axios.delete(`${API_BASE_URL}/achievements/${achievementId}`, { // Измененный эндпоинт
        headers: { Authorization: `Bearer ${token}` },
      });

      // Обновляем список достижений, удаляя удаленное
      setAchievements(achievements.filter((achievement) => achievement.id !== achievementId));
      alert("Достижение успешно удалено!"); // Измененное сообщение
    } catch (error) {
      console.error("Ошибка при удалении достижения:", error); // Измененное сообщение
      alert("Не удалось удалить достижение. Проверьте консоль для деталей."); // Измененное сообщение
    }
  };

  useEffect(() => {
    const fetchAchievements = async () => { // Изменена функция получения данных
      try {
        const response = await axios.get(`${API_BASE_URL}/achievements/all`, { // Измененный эндпоинт
          headers: { Authorization: `Bearer ${token}` },
        });
        setAchievements(response.data); // Устанавливаем полученные достижения
      } catch (error) {
        console.error("Ошибка при получении достижений:", error); // Измененное сообщение
        alert("Не удалось получить достижения. Проверьте консоль для деталей."); // Измененное сообщение
      }
    };

    fetchAchievements();
  }, [token]); // Зависимость от токена

  return (
    <div>
      <h2 className="Chapter-title">Достижения</h2> {/* Измененный заголовок */}
      {achievements.length > 0 ? ( // Проверяем наличие достижений
        <div className="Coach-wrapper">
          <div className="Coach-list">
            {achievements.map((achievement) => ( // Итерируем по достижениям
              <div key={achievement.id} className="Training-item Admin-training-item">
                <div className="Training-info">
                  <div className="Admin-training-title">
                    <button
                      className="Delete-button"
                      onClick={() => handleDeleteAchievement(achievement.id)} // Вызов функции удаления достижения
                    >
                      X
                    </button>
                    <button
                      className="Edit-button"
                      onClick={() => handleEditAchievement(achievement.id)} // Вызов функции редактирования достижения
                    >
                      Изменить
                    </button>
                  </div>
                  <h3>
                    {achievement.achievement_name} {/* Отображаем название достижения */}
                  </h3>
                  <p>Описание: {achievement.description}</p> {/* Отображаем описание */}
                  <p>Критерии: {achievement.criteria}</p> {/* Отображаем критерии */}
                </div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Доступных достижений нет.</p> // Сообщение, если нет достижений
      )}
    </div>
  );
}

export default InfoAchievements; // Измененный экспорт