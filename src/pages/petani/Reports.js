import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Card, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
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
    const chart = months.map(m => ({ name: m, penjualan: 0 }));

    data.forEach(item => {
      const dateStr = item.tanggalTransaksi || item.createdAt;
      if (dateStr) {
        const monthIndex = moment(dateStr).month();
        const qty = item.pengajuan?.panen?.jumlahPanen || 0;
        chart[monthIndex].penjualan += qty;
      }
    });

    // Ambil 6 bulan terakhir sampai bulan ini
    const currentMonth = moment().month();
    let startMonth = currentMonth - 5;
    if (startMonth < 0) startMonth = 0;
    
    return chart.slice(startMonth, currentMonth + 1);
  };

  const chartData = generateChartData();

  const columns = [
    { 
      title: 'Tanggal Deal', 
      dataIndex: 'tanggalTransaksi',
      render: val => moment(val).format('DD MMM YYYY')
    },
    { 
      title: 'Tengkulak (Pembeli)', 
      dataIndex: ['pengajuan', 'tengkulak', 'name'],
      render: (text, record) => record.pengajuan?.tengkulak?.name || '-'
    },
    { 
      title: 'Kuantitas Terjual', 
      dataIndex: ['pengajuan', 'panen', 'jumlahPanen'],
      render: (text, record) => record.pengajuan?.panen ? `${record.pengajuan.panen.jumlahPanen} Ton` : '-'
    },
    { 
      title: 'Harga/Kg', 
      dataIndex: ['pengajuan', 'hargaDeal'],
      render: (text, record) => `Rp ${record.pengajuan?.hargaDeal || record.hargaDeal || 0}`
    },
    { 
      title: 'Total Pendapatan', 
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
      <Title level={3} style={{ marginBottom: 24 }}>Laporan Hasil Penjualan Padi</Title>
      
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Title level={5} style={{ marginBottom: 16, color: '#666' }}>Grafik Penjualan Anda (Ton)</Title>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip cursor={{ fill: 'rgba(76, 175, 80, 0.1)' }} />
              <Bar dataKey="penjualan" fill="#4caf50" name="Penjualan (Ton)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Table dataSource={data} columns={columns} rowKey="id" bordered loading={loading} scroll={{ x: 'max-content' }} />
    </div>
  );
};
export default Reports;
