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

function EditPost({ token, postId, setActiveTab }) {
  const [userId, setUserId] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postInfo, setPostInfo] = useState("");
  const [postImage, setPostImage] = useState("");
  const fileInputRef = useRef(null);

  const handleLoadPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPostImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/news/${postId}`,
        {
          post_title: postTitle,
          post_info: postInfo,
          post_image: postImage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Данные успешно изменены!");
      setActiveTab("infoPosts");
    } catch (error) {
      console.error("Edit post failed:", error);
      alert("Edit post failed. Check the console for details.");
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching resident ID:", error);
        alert("Failed to fetch resident ID. Check the console for details.");
      }
    };

    const fetchPostInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/news/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        setPostTitle(data.post_title);
        setPostInfo(data.post_info);
        setPostImage(data.post_image);
      } catch (error) {
        console.error("Error fetching news:", error);
        alert("Failed to fetch news. Check the console for details.");
      }
    };

    fetchUserId();
    fetchPostInfo();

  }, [token]);

  return (
    <div>
      <h2 className="Chapter-title">Изменить новость</h2>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleEditPost}>
          <div className="Auth-form-content">
            <div className="form-group mt-3">
              <label htmlFor="postTitle">Title:</label>
              <input
                type="text"
                id="postTitle"
                className="form-control"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="postInfo">Info:</label>
              <textarea
                id="postInfo"
                className="form-control"
                value={postInfo}
                onChange={(e) => setPostInfo(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <div className="Show-photo-div">
                {postImage && (
                  <img
                    src={postImage}
                    alt="Uploaded"
                    style={{ maxWidth: "200px", maxHeight: "200px" }} // Adjust size as needed
                  />
                )}
              </div>
              <button
                className="Select-button"
                type="button" // Prevent button from submitting form
                onClick={handleLoadPhoto}
              >
                Добавить фото
              </button>
              {/* Hidden file input */}
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*" // Only allow image files
                onChange={handleFileChange}
                ref={fileInputRef} // Attach the ref
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
