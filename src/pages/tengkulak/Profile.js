import React, { useEffect, useState } from 'react';
import { Typography, Descriptions, Avatar, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Profile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div>
      <Title level={3}>Profil Tengkulak</Title>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginRight: 16 }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>{user.name || 'Tengkulak'}</Title>
            <p style={{ margin: 0, color: '#666' }}>{user.email || 'tengkulak@manajemenpadi.com'}</p>
          </div>
        </div>
        <Descriptions title="Informasi Akun" bordered column={1}>
          <Descriptions.Item label="Nama Lengkap">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Alamat">{user.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="Peran">Tengkulak</Descriptions.Item>
          <Descriptions.Item label="Status">{user.isSuspended ? 'Suspend' : 'Aktif'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;
