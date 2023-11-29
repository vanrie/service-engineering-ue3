import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/header';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import React from "react";



function App() {
  return (
    <div className="App">
        <Header></Header>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
