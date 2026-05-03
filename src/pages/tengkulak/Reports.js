import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Card, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { transaksiAPI } from '../../services/api';
import moment from 'moment';

const { Title } = Typography;

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

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

  const chartData = generateChartData();

  const columns = [
    { 
      title: 'Tanggal', 
      dataIndex: 'tanggalTransaksi',
      render: val => moment(val).format('DD MMM YYYY')
    },
    { 
      title: 'Mitra Transaksi (Petani)', 
      dataIndex: ['pengajuan', 'petani', 'name'],
      render: (text, record) => record.pengajuan?.petani?.name || '-'
    },
    { 
      title: 'Jenis Transaksi', 
      dataIndex: 'type', 
      render: () => <Tag color="blue">Beli dari Petani</Tag> 
    },
    { 
      title: 'Kuantitas', 
      dataIndex: ['pengajuan', 'panen', 'jumlahPanen'],
      render: (text, record) => record.pengajuan?.panen ? `${record.pengajuan.panen.jumlahPanen} Ton` : '-'
    },
    { 
      title: 'Total Pembelian', 
      dataIndex: 'totalHarga',
      render: val => `Rp ${val.toLocaleString('id-ID')}`
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      render: () => <Tag color="green">Selesai</Tag> 
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Laporan Pembelian & Penjualan</Title>

      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Title level={5} style={{ marginBottom: 16, color: '#666' }}>Grafik Aktivitas Transaksi (Ton)</Title>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Legend />
              <Bar dataKey="beli" fill="#1890ff" name="Pembelian Padi" radius={[4, 4, 0, 0]} />
              <Bar dataKey="jual" fill="#722ed1" name="Penjualan ke Pabrik" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Table dataSource={data} columns={columns} rowKey="id" bordered loading={loading} scroll={{ x: 'max-content' }} />
    </div>
  );
};
export default Reports;
