import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "../../../App.css";

const API_BASE_URL = "http://localhost:8000";

function InfoPosts({ token, handleEditPost }) {
  const admins = ["administrator"];
  const [username, setUsername] = useState(null);

  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
        alert("Failed to fetch username. Check the console for details.");
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/news/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        alert("Failed to fetch news. Check the console for details.");
      }
    };

    fetchUsername();
    fetchNews();
  }, [token]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_BASE_URL}/news/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNews(news.filter((post) => post.id !== postId));
      alert("Post deleting cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling post deleting:", error);
      alert("Failed to delete post. Check the console for details.");
    }
  };

  return (
    <div>
      <h2 className="Chapter-title">Новости</h2>
      {news.length > 0 ? (
        <div className="News-wrapper">
          <div className="News-list">
            {news.map((post) => (
              <div key={post.id} className="News-item">
                <div className="News-photo-div">
                  {post.post_image && (
                    <img
                      className="News-image"
                      src={post.post_image}
                      alt="Uploaded"
                    />
                  )}
                </div>
                <div className="News-info">
                  <div className="Admin-training-title">
                    <button
                      className="Delete-button"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      X
                    </button>
                    <button
                      className="Edit-button"
                      onClick={() => handleEditPost(post.id)}
                    >
                      Изменить
                    </button>
                  </div>
                  <h3>{post.post_title}</h3>
                  <p>{post.post_info}</p>
                  <p>
                    <b>{post.username}</b>
                  </p>
                  <p>
                    Опубликован: {new Date(post.post_time).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
}

export default InfoPosts;
