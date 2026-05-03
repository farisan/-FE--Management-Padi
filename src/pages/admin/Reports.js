import React, { useState, useEffect } from 'react';
import { Tabs, Typography, Table, Card, Row, Col, Statistic, Tag, Button, message } from 'antd';
import { DownloadOutlined, DollarOutlined, ExperimentOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { transaksiAPI } from '../../services/api';
import moment from 'moment';

const { Title } = Typography;

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

const LaporanPetani = ({ data, loading }) => {
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chart = months.map(m => ({ name: m, volume: 0 }));

    data.forEach(item => {
      const dateStr = item.tanggalTransaksi || item.createdAt;
      if (dateStr) {
        const monthIndex = moment(dateStr).month();
        const qty = item.pengajuan?.panen?.jumlahPanen || 0;
        chart[monthIndex].volume += qty;
      }
    });

    const currentMonth = moment().month();
    let startMonth = currentMonth - 5;
    if (startMonth < 0) startMonth = 0;
    return chart.slice(startMonth, currentMonth + 1);
  };

  const chartDataPetani = generateChartData();

  const columns = [
    { 
      title: 'Tanggal', 
      dataIndex: 'tanggalTransaksi',
      render: val => moment(val).format('DD MMM YYYY')
    },
    { 
      title: 'Nama Petani', 
      dataIndex: ['pengajuan', 'petani', 'name'],
      render: (text, record) => record.pengajuan?.petani?.name || '-'
    },
    { 
      title: 'Pembeli (Tengkulak)', 
      dataIndex: ['pengajuan', 'tengkulak', 'name'],
      render: (text, record) => record.pengajuan?.tengkulak?.name || '-'
    },
    { 
      title: 'Jenis Padi', 
      dataIndex: ['pengajuan', 'panen', 'penanaman', 'jenisPadi'],
      render: (text, record) => record.pengajuan?.panen?.penanaman?.jenisPadi || '-'
    },
    { 
      title: 'Kuantitas (Ton)', 
      dataIndex: ['pengajuan', 'panen', 'jumlahPanen'],
      render: (text, record) => record.pengajuan?.panen?.jumlahPanen || 0
    },
    { 
      title: 'Total Harga', 
      dataIndex: 'totalHarga', 
      render: (val) => formatRupiah(val) 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      render: () => <Tag color="green">SELESAI</Tag>
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Transaksi Sistem" value={data.length} prefix={<ExperimentOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="Total Perputaran Uang" 
              value={data.reduce((sum, item) => sum + item.totalHarga, 0)} 
              prefix={<DollarOutlined />} 
              formatter={(val) => formatRupiah(val)} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Status" value={'Aktif'} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16, borderRadius: 8 }}>
        <Title level={5} style={{ marginBottom: 16, color: '#666' }}>Grafik Volume Penjualan Petani per Bulan</Title>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartDataPetani} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip cursor={{ fill: 'rgba(76, 175, 80, 0.1)' }} />
              <Legend />
              <Bar dataKey="volume" fill="#4caf50" name="Volume Penjualan (Ton)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<DownloadOutlined />}>Unduh Laporan</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" bordered scroll={{ x: 'max-content' }} loading={loading} />
    </div>
  );
};

const LaporanTengkulak = ({ data, loading }) => {
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chart = months.map(m => ({ name: m, beli: 0, jual: 0 }));

    data.forEach(item => {
      const dateStr = item.tanggalTransaksi || item.createdAt;
      if (dateStr) {
        const monthIndex = moment(dateStr).month();
        const qty = item.pengajuan?.panen?.jumlahPanen || 0;
        chart[monthIndex].beli += qty;
      }
    });

    const currentMonth = moment().month();
    let startMonth = currentMonth - 5;
    if (startMonth < 0) startMonth = 0;
    return chart.slice(startMonth, currentMonth + 1);
  };

  const chartDataTengkulak = generateChartData();

  const columns = [
    { 
      title: 'Tanggal', 
      dataIndex: 'tanggalTransaksi',
      render: val => moment(val).format('DD MMM YYYY')
    },
    { 
      title: 'Nama Tengkulak', 
      dataIndex: ['pengajuan', 'tengkulak', 'name'],
      render: (text, record) => record.pengajuan?.tengkulak?.name || '-'
    },
    { 
      title: 'Jenis Transaksi', 
      dataIndex: 'transactionType', 
      render: () => <Tag color="blue">Beli dari Petani</Tag>
    },
    { 
      title: 'Mitra (Petani)', 
      dataIndex: ['pengajuan', 'petani', 'name'],
      render: (text, record) => record.pengajuan?.petani?.name || '-'
    },
    { 
      title: 'Kuantitas (Ton)', 
      dataIndex: ['pengajuan', 'panen', 'jumlahPanen'],
      render: (text, record) => record.pengajuan?.panen?.jumlahPanen || 0
    },
    { title: 'Total Nilai', dataIndex: 'totalHarga', render: (val) => formatRupiah(val) },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      render: () => <Tag color="green">SELESAI</Tag>
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Pembelian" value={data.length} prefix={<ExperimentOutlined />} suffix="Transaksi" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Penjualan" value={0} prefix={<ExperimentOutlined />} suffix="Ton" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Omset Berjalan" value={data.reduce((sum, item) => sum + item.totalHarga, 0)} prefix={<DollarOutlined />} formatter={(val) => formatRupiah(val)} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16, borderRadius: 8 }}>
        <Title level={5} style={{ marginBottom: 16, color: '#666' }}>Grafik Pembelian & Penjualan Tengkulak per Bulan</Title>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartDataTengkulak} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Legend />
              <Bar dataKey="beli" fill="#1890ff" name="Beli dari Petani (Ton)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="jual" fill="#722ed1" name="Jual ke Pabrik (Ton)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<DownloadOutlined />}>Unduh Laporan</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" bordered scroll={{ x: 'max-content' }} loading={loading} />
    </div>
  );
};

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await transaksiAPI.getAll();
        setData(response.data.data);
      } catch (error) {
        message.error('Gagal mengambil data laporan');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const items = [
    {
      key: '1',
      label: 'Laporan Petani',
      children: <LaporanPetani data={data} loading={loading} />,
    },
    {
      key: '2',
      label: 'Laporan Tengkulak',
      children: <LaporanTengkulak data={data} loading={loading} />,
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Laporan Transaksi</Title>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default Reports;
