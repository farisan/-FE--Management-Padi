import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TengkulakLayout from '../pages/tengkulak/TengkulakLayout';
import Profile from '../pages/tengkulak/Profile';
import ManageApproval from '../pages/tengkulak/ManageApproval';
import Reports from '../pages/tengkulak/Reports';

const TengkulakRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TengkulakLayout />}>
        <Route index element={<Navigate to="profil" replace />} />
        <Route path="profil" element={<Profile />} />
        <Route path="approval" element={<ManageApproval />} />
        <Route path="laporan" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default TengkulakRoutes;
