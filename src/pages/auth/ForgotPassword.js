import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // Simulate sending email
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <EnvironmentOutlined />
          </div>
          <h2 className="auth-title">Lupa Password</h2>
          <p className="auth-subtitle">Masukkan email Anda untuk reset password</p>
        </div>

        <Form
          name="forgot_password"
          className="forgot-password-form"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: 'Format email tidak valid!' },
              { required: true, message: 'Harap masukkan Email Anda!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Masukkan Email Anda" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Kirim Link Reset
            </Button>
          </Form.Item>
        </Form>
        <div className="auth-footer">
          Kembali ke <Link to="/login">Halaman Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
