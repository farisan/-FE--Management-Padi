import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Space, Tag, Input, Select, Modal, Form, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { userAPI, authAPI } from '../../services/api';

const { Title } = Typography;
const { Option } = Select;

const ManageUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAll();
      setData(response.data.data);
    } catch (error) {
      message.error('Gagal mengambil data user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSuspendToggle = async (record) => {
    try {
      const newSuspendStatus = !record.isSuspended;
      await authAPI.suspend(record.id, newSuspendStatus);
      message.success(`Status user berhasil diubah.`);
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal mengubah status');
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingUser) {
          // Update
          await userAPI.update(editingUser.id, values);
          message.success('Data user berhasil diperbarui.');
        } else {
          // Add via register
          await authAPI.register(values);
          message.success('User baru berhasil ditambahkan.');
        }
        setIsModalVisible(false);
        fetchUsers();
      } catch (error) {
        message.error(error.response?.data?.message || 'Terjadi kesalahan');
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  // Filter Data
  const filteredData = data.filter(item => {
    const matchEmail = item.email.toLowerCase().includes(searchText.toLowerCase()) || item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchRole = roleFilter === 'all' || item.role === roleFilter;
    return matchEmail && matchRole;
  });

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nama Lengkap',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Peran',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'purple' : role === 'tengkulak' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isSuspended',
      key: 'isSuspended',
      render: (isSuspended) => (
        <Tag color={isSuspended ? 'error' : 'success'}>
          {isSuspended ? 'SUSPEND' : 'AKTIF'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title={`Apakah Anda yakin ingin ${!record.isSuspended ? 'men-suspend' : 'mengaktifkan'} user ini?`}
            onConfirm={() => handleSuspendToggle(record)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button
              danger={!record.isSuspended}
              type={!record.isSuspended ? 'default' : 'primary'}
              icon={!record.isSuspended ? <StopOutlined /> : <CheckCircleOutlined />}
              size="small"
            >
              {!record.isSuspended ? 'Suspend' : 'Aktifkan'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Management User</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Tambah User
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="Cari Email atau Nama..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          defaultValue="all"
          value={roleFilter}
          onChange={value => setRoleFilter(value)}
          style={{ width: 150 }}
        >
          <Option value="all">Semua Peran</Option>
          <Option value="petani">Petani</Option>
          <Option value="tengkulak">Tengkulak</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </div>

      <Table scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        loading={loading}
      />

      <Modal
        title={editingUser ? "Edit User" : "Tambah User Baru"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Harap masukkan email!' }]}
          >
            <Input placeholder="Masukkan email" type="email" disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nama Lengkap"
            rules={[{ required: true, message: 'Harap masukkan nama lengkap!' }]}
          >
            <Input placeholder="Masukkan nama lengkap" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Alamat"
          >
            <Input placeholder="Masukkan alamat" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Peran"
            rules={[{ required: true, message: 'Harap pilih peran!' }]}
          >
            <Select placeholder="Pilih Peran">
              <Option value="petani">Petani</Option>
              <Option value="tengkulak">Tengkulak</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            label={editingUser ? "Password Baru (Opsional)" : "Password"}
            rules={[{ required: !editingUser, message: 'Harap masukkan password!' }]}
          >
            <Input.Password placeholder="Masukkan password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
