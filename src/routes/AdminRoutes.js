import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin Pages
import AdminLayout from '../pages/admin/AdminLayout';
import Profile from '../pages/admin/Profile';
import ManageUsers from '../pages/admin/ManageUsers';
import ManagePadi from '../pages/admin/ManagePadi';
import ManageApproval from '../pages/admin/ManageApproval';
import Reports from '../pages/admin/Reports';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Redirect dari /admin ke /admin/profil */}
        <Route index element={<Navigate to="profil" replace />} />
        <Route path="profil" element={<Profile />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="padi" element={<ManagePadi />} />
        <Route path="approval" element={<ManageApproval />} />
        <Route path="laporan" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
