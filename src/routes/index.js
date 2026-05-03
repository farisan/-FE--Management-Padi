import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import TengkulakRoutes from './TengkulakRoutes';
import PetaniRoutes from './PetaniRoutes';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Role Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/tengkulak/*" element={<TengkulakRoutes />} />
        <Route path="/petani/*" element={<PetaniRoutes />} />

        {/* Default route redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
