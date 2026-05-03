import React from 'react';
import { ConfigProvider } from 'antd';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4caf50', // Tema Hijau
          borderRadius: 8,
        },
      }}
    >
      <div className="App">
        <AppRoutes />
      </div>
    </ConfigProvider>
  );
}

export default App;
