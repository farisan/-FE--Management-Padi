import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Space, Tag, Popconfirm, message, Modal, Form, Input } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { pengajuanAPI } from '../../services/api';
import moment from 'moment';

const { Title } = Typography;

const ManageApproval = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDealModalVisible, setIsDealModalVisible] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pengajuanAPI.getAll();
      setData(response.data.data);
    } catch (error) {
      message.error('Gagal mengambil data pengajuan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveCheck = async (record) => {
    try {
      await pengajuanAPI.dilihat(record.id);
      message.success('Status pengajuan menjadi Proses Cek');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal mengupdate status');
    }
  };

  const handleReject = async (record) => {
    try {
      await pengajuanAPI.respon(record.id, { status: 'reject', catatan: 'Ditolak Tengkulak' });
      message.success('Pengajuan ditolak');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal menolak pengajuan');
    }
  };

  const handleDealClick = (record) => {
    setSelectedProposal(record);
    form.resetFields();
    form.setFieldsValue({
      finalPrice: record.hargaTawaran
    });
    setIsDealModalVisible(true);
  };

  const handleDealSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        await pengajuanAPI.respon(selectedProposal.id, {
          status: 'approve',
          catatan: 'Disetujui',
          hargaDeal: parseFloat(values.finalPrice)
        });
        setIsDealModalVisible(false);
        message.success('Penjualan berhasil disetujui (Deal)!');
        fetchData();
      } catch (error) {
        message.error(error.response?.data?.message || 'Gagal menyetujui');
      }
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'orange';
      case 'dilihat': return 'blue';
      case 'disetujui': return 'green';
      case 'ditolak': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    { 
      title: 'Tanggal Ajuan', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: val => moment(val).format('DD MMM YYYY')
    },
    { 
      title: 'Petani Pengaju', 
      dataIndex: ['petani', 'name'], 
      key: 'petaniName',
      render: (text, record) => record.petani?.name || '-'
    },
    { 
      title: 'Jumlah Panen', 
      dataIndex: ['panen', 'jumlahPanen'], 
      key: 'qty',
      render: (text, record) => record.panen ? `${record.panen.jumlahPanen} Ton` : '-'
    },
    { 
      title: 'Harga Penawaran', 
      dataIndex: 'hargaTawaran', 
      key: 'hargaTawaran',
      render: val => `Rp ${val}`
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button type="primary" icon={<EyeOutlined />} onClick={() => handleApproveCheck(record)} size="small">
                Approve (Lihat Padi)
              </Button>
              <Popconfirm title="Tolak pengajuan ini secara langsung?" onConfirm={() => handleReject(record)}>
                <Button danger icon={<CloseOutlined />} size="small">Tolak</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 'dilihat' && (
            <>
              <Button type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} icon={<CheckOutlined />} onClick={() => handleDealClick(record)} size="small">
                Deal (Setujui)
              </Button>
              <Popconfirm title="Tolak setelah cek padi?" onConfirm={() => handleReject(record)}>
                <Button danger icon={<CloseOutlined />} size="small">Tolak</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>Management Approval Pengajuan Padi</Title>
      <Table columns={columns} dataSource={data} rowKey="id" bordered loading={loading} scroll={{ x: 'max-content' }} />

      <Modal title="Kesepakatan Akhir (Deal)" open={isDealModalVisible} onOk={handleDealSubmit} onCancel={() => setIsDealModalVisible(false)} okText="Deal & Selesai">
        <Form form={form} layout="vertical">
          <Form.Item name="finalPrice" label="Harga Deal Akhir / Kg (Rp)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default ManageApproval;
