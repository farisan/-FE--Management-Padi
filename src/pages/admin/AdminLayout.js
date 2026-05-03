import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      navigate('/login');
    } else {
      navigate(`/admin/${key}`);
    }
  };

  // Determine selected key based on current path
  const currentPath = location.pathname.split('/')[2] || 'profil';

  const menuItems = [
    {
      key: 'profil',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Management User',
    },
    {
      key: 'padi',
      icon: <AppstoreOutlined />,
      label: 'Management Padi',
    },
    {
      key: 'approval',
      icon: <CheckCircleOutlined />,
      label: 'Management Approval',
    },
    {
      key: 'laporan',
      icon: <FileTextOutlined />,
      label: 'Laporan',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Keluar',
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" onCollapse={(value) => setCollapsed(value)} trigger={null} collapsible collapsed={collapsed} theme="light" style={{ boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)', zIndex: 2 }}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(76, 175, 80, 0.1)', 
          borderRadius: 6, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#2e7d32', 
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}>
          {collapsed ? 'MP' : 'Manajemen Padi'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentPath]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,.08)', zIndex: 1 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Admin Dashboard</h2>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
