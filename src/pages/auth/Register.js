import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Auth.css';

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authAPI.register(values);
      message.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registrasi gagal. Coba lagi.';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <EnvironmentOutlined />
          </div>
          <h2 className="auth-title">Daftar Akun Baru</h2>
          <p className="auth-subtitle">Bergabung dengan Sistem Manajemen Padi</p>
        </div>

        <Form
          name="register"
          className="register-form"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Harap masukkan Nama Lengkap Anda!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nama Lengkap" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: 'Format email tidak valid!' },
              { required: true, message: 'Harap masukkan Email Anda!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Harap masukkan Alamat Anda!' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Alamat" />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Harap pilih Peran Anda!' }]}
          >
            <Select placeholder="Pilih Peran">
              <Option value="petani">Petani</Option>
              <Option value="tengkulak">Tengkulak</Option>
              {/* <Option value="admin">Admin</Option> */}
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Harap masukkan Password Anda!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-form-button" block loading={loading}>
              Daftar
            </Button>
          </Form.Item>
        </Form>
        <div className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
