import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { penanamanAPI } from '../../services/api';
import moment from 'moment';

const { Title } = Typography;

const ManagePadi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await penanamanAPI.getAll();
      setData(response.data.data);
    } catch (error) {
      message.error('Gagal mengambil data padi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'proses': return 'blue';
      case 'panen': return 'cyan';
      case 'diajukan': return 'orange';
      case 'proses cek': return 'purple';
      case 'disetujui': return 'green';
      case 'ditolak': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    { 
      title: 'Nama Petani', 
      dataIndex: ['petani', 'name'], 
      key: 'petaniName',
      render: (text, record) => record.petani?.name || '-'
    },
    { title: 'Jenis Padi', dataIndex: 'jenisPadi', key: 'jenisPadi' },
    { 
      title: 'Tanggal Tebar Benih', 
      dataIndex: 'tanggalTebar', 
      key: 'tanggalTebar',
      render: val => moment(val).format('DD MMM YYYY')
    },
    { 
      title: 'Perkiraan Panen', 
      dataIndex: 'estimasiPanen', 
      key: 'estimasiPanen',
      render: val => moment(val).format('DD MMM YYYY')
    },
    { title: 'Luas Lahan (Hektar)', dataIndex: 'luasLahan', key: 'luasLahan' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
    }
  ];

  const filteredData = data.filter(item => 
    item.petani?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.jenisPadi?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Monitoring Data Padi Global</Title>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input 
          placeholder="Cari nama petani, jenis padi atau status..." 
          prefix={<SearchOutlined />} 
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 350 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="id" bordered loading={loading} scroll={{ x: 'max-content' }} />
    </div>
  );
};

export default ManagePadi;
