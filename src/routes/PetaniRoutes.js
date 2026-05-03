import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PetaniLayout from '../pages/petani/PetaniLayout';
import Profile from '../pages/petani/Profile';
import ManagePadi from '../pages/petani/ManagePadi';
import Reports from '../pages/petani/Reports';

const PetaniRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PetaniLayout />}>
        <Route index element={<Navigate to="profil" replace />} />
        <Route path="profil" element={<Profile />} />
        <Route path="padi" element={<ManagePadi />} />
        <Route path="laporan" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default PetaniRoutes;
