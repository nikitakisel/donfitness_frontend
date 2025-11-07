import React, { useState, useEffect } from "react";
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

function ExtendSubscription({ token }) {
  return (
    <div>
      <h2 className="Chapter-title">Продлить абонемент</h2>
      <p>Упс, обратитесь к стойке администрации клуба.</p>
    </div>
  );
}

export default ExtendSubscription;
