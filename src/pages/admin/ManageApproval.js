import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Input, Button, Modal, Descriptions, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { pengajuanAPI } from '../../services/api';
import moment from 'moment';

const { Title } = Typography;

const ManageApproval = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'orange';
      case 'dilihat': return 'blue';
      case 'disetujui': return 'green';
      case 'ditolak': return 'red';
      default: return 'default';
    }
  };

  const showDetails = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const columns = [
    { 
      title: 'Tanggal', 
      dataIndex: 'createdAt', 
      key: 'date',
      render: val => moment(val).format('DD MMM YYYY')
    },
    { 
      title: 'Petani', 
      dataIndex: ['petani', 'name'], 
      key: 'petaniName',
      render: (text, record) => record.petani?.name || '-'
    },
    { 
      title: 'Tengkulak Tujuan', 
      dataIndex: ['tengkulak', 'name'], 
      key: 'tengkulakName',
      render: (text, record) => record.tengkulak?.name || '-'
    },
    { 
      title: 'Status Transaksi', 
      dataIndex: 'status', 
      key: 'status',
      render: status => <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => showDetails(record)}>
          Detail
        </Button>
      )
    }
  ];

  const filteredData = data.filter(item => 
    item.petani?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.tengkulak?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Title level={3} style={{ marginBottom: 16 }}>Monitoring Pengajuan & Transaksi</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Input 
          placeholder="Cari nama petani, tengkulak, atau status..." 
          prefix={<SearchOutlined />} 
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 350 }}
        />
      </div>

      <Table columns={columns} dataSource={filteredData} rowKey="id" bordered loading={loading} scroll={{ x: 'max-content' }} />

      <Modal 
        title="Detail Transaksi Padi" 
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>Tutup</Button>
        ]}
      >
        {selectedRecord && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tanggal Ajuan">{moment(selectedRecord.createdAt).format('DD MMM YYYY HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Petani Pengaju">{selectedRecord.petani?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="Tengkulak Tujuan">{selectedRecord.tengkulak?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="Status Saat Ini">
              <Tag color={getStatusColor(selectedRecord.status)}>{selectedRecord.status?.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Jumlah Panen">{selectedRecord.panen?.jumlahPanen} Ton</Descriptions.Item>
            <Descriptions.Item label="Penawaran Awal (Harga)">Rp {selectedRecord.hargaTawaran}</Descriptions.Item>
            <Descriptions.Item label="Catatan Tengkulak">{selectedRecord.catatan || '-'}</Descriptions.Item>
            <Descriptions.Item label="Harga Deal Final">Rp {selectedRecord.hargaDeal || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};
export default ManageApproval;
