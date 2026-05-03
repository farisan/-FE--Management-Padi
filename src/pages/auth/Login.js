import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login({
        email: values.email,
        password: values.password
      });
      
      const { token, data } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      
      message.success('Login berhasil!');
      
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'tengkulak') {
        navigate('/tengkulak');
      } else {
        navigate('/petani');
      }
      
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login gagal. Coba lagi.';
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
          <h2 className="auth-title">Masuk ke Akun</h2>
          <p className="auth-subtitle">Sistem Manajemen Padi</p>
        </div>

        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Harap masukkan Email Anda!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Harap masukkan Password Anda!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Link className="login-form-forgot" to="/forgot-password" style={{ float: 'right' }}>
              Lupa password?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" block loading={loading}>
              Masuk
            </Button>
          </Form.Item>
        </Form>
        <div className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
