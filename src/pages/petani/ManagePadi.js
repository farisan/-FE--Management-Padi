import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Space, Tag, Modal, Form, Input, DatePicker, message, Select, Row, Col, Card } from 'antd';
import { PlusOutlined, SendOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { penanamanAPI, panenAPI, pengajuanAPI, userAPI } from '../../services/api';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const ManagePadi = () => {
  const [data, setData] = useState([]);
  const [tengkulakList, setTengkulakList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSellModalVisible, setIsSellModalVisible] = useState(false);
  const [selectedPadi, setSelectedPadi] = useState(null);
  
  // Filter states
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  const [form] = Form.useForm();
  const [sellForm] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await penanamanAPI.getAll();
      setData(response.data.data);
    } catch (error) {
      message.error('Gagal mengambil data penanaman');
    } finally {
      setLoading(false);
    }
  };

  const fetchTengkulak = async () => {
    try {
      const response = await userAPI.getUserTengkulak();
      const list = response.data.data.filter(u => u.role === 'tengkulak' && !u.isSuspended);
      setTengkulakList(list);
    } catch (error) {
      console.error('Gagal mengambil daftar tengkulak', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTengkulak();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const payload = {
          tanggalTebar: values.tanggalTebar.format('YYYY-MM-DD'),
          estimasiPanen: values.estimasiPanen.format('YYYY-MM-DD'),
          luasLahan: parseFloat(values.luasLahan),
          jenisPadi: values.jenisPadi,
          status: 'proses'
        };
        await penanamanAPI.create(payload);
        message.success('Data penanaman berhasil ditambahkan!');
        setIsModalVisible(false);
        fetchData();
      } catch (error) {
        message.error(error.response?.data?.message || 'Gagal menambah data');
      }
    });
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await penanamanAPI.update(id, { status: newStatus });
      message.success(`Status berhasil diubah menjadi: ${newStatus.toUpperCase()}`);
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal mengubah status');
    }
  };

  const handleSellClick = (record) => {
    setSelectedPadi(record);
    sellForm.resetFields();
    setIsSellModalVisible(true);
  };

  const handleSellSubmit = () => {
    sellForm.validateFields().then(async (values) => {
      try {
        const panenRes = await panenAPI.create({
          penanamanId: selectedPadi.id,
          tanggalPanen: moment().format('YYYY-MM-DD'),
          jumlahPanen: parseFloat(values.estimatedQty),
          kualitas: 'Standard'
        });

        await pengajuanAPI.create({
          panenId: panenRes.data.data.id,
          tengkulakId: values.tengkulak,
          hargaTawaran: parseFloat(values.proposedPrice)
        });

        setIsSellModalVisible(false);
        message.success('Pengajuan penjualan berhasil dikirim ke Tengkulak!');
        fetchData();
      } catch (error) {
        message.error(error.response?.data?.message || 'Gagal mengajukan penjualan. Coba lagi.');
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
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
    { title: 'Jenis Padi', dataIndex: 'jenisPadi', key: 'jenisPadi' },
    {
      title: 'Tanggal Tebar',
      dataIndex: 'tanggalTebar',
      key: 'tanggalTebar',
      render: (val) => moment(val).format('DD MMM YYYY')
    },
    {
      title: 'Perkiraan Panen',
      dataIndex: 'estimasiPanen',
      key: 'estimasiPanen',
      render: (val) => moment(val).format('DD MMM YYYY')
    },
    { title: 'Luas (Ha)', dataIndex: 'luasLahan', key: 'luasLahan' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let display = status?.toUpperCase();
        if (status === 'diajukan') display = 'MENUNGGU RESPON';
        if (status === 'pengajuan') display = 'MENUNGGU RESPON';
        return <Tag color={getStatusColor(status)}>{display}</Tag>;
      }
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'disetujui') return <span>-</span>;
        return (
          <Space size="middle">
            {record.status === 'proses' && (
              <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => updateStatus(record.id, 'panen')}>
                Siap Panen
              </Button>
            )}
            {record.status === 'panen' && (
              <Button size="small" type="primary" ghost icon={<SendOutlined />} onClick={() => handleSellClick(record)}>
                Ajukan Jual
              </Button>
            )}
            {record.status === 'ditolak' && (
              <Button size="small" danger ghost icon={<SendOutlined />} onClick={() => handleSellClick(record)}>
                Ajukan Ulang
              </Button>
            )}
          </Space>
        )
      }
    }
  ];

  // Filtering Logic
  const filteredData = data.filter(item => {
    let matchDate = true;
    if (filterDate) {
      const filterMonth = filterDate.month();
      const filterYear = filterDate.year();
      const itemTebar = moment(item.tanggalTebar);
      const itemPanen = moment(item.estimasiPanen);
      
      const matchTebar = itemTebar.month() === filterMonth && itemTebar.year() === filterYear;
      const matchPanen = itemPanen.month() === filterMonth && itemPanen.year() === filterYear;
      
      matchDate = matchTebar || matchPanen;
    }
    
    let matchStatus = true;
    if (filterStatus) {
      matchStatus = item.status === filterStatus;
    }
    
    return matchDate && matchStatus;
  });

  const activeData = filteredData.filter(item => item.status !== 'disetujui');
  const historyData = filteredData.filter(item => item.status === 'disetujui');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Management Padi (Siklus Tanam)</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Tambah Data Tanam</Button>
      </div>

      <Card style={{ marginBottom: 16, borderRadius: 8 }} size="small">
        <Space wrap>
          <DatePicker picker="month" placeholder="Cari Bulan Tanam/Panen" onChange={date => setFilterDate(date)} />
          <Select placeholder="Filter Status" allowClear style={{ width: 200 }} onChange={val => setFilterStatus(val)}>
            <Option value="proses">Proses</Option>
            <Option value="panen">Panen</Option>
            <Option value="diajukan">Menunggu Respon</Option>
            <Option value="proses cek">Proses Cek</Option>
            <Option value="ditolak">Ditolak</Option>
            <Option value="disetujui">Disetujui</Option>
          </Select>
        </Space>
      </Card>

      <Title level={4} style={{ marginBottom: 16 }}>Siklus Aktif</Title>
      <Table columns={columns} dataSource={activeData} rowKey="id" bordered loading={loading} style={{ marginBottom: 32 }} scroll={{ x: 'max-content' }} />

      <Title level={4} style={{ marginBottom: 16 }}>Histori Transaksi (Selesai/Deal)</Title>
      <Table columns={columns} dataSource={historyData} rowKey="id" bordered loading={loading} scroll={{ x: 'max-content' }} />

      <Modal title="Tambah Data Tanam Baru" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} okText="Simpan">
        <Form form={form} layout="vertical">
          <Form.Item name="jenisPadi" label="Jenis Padi" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <Input placeholder="Contoh: Rojolele, Ciherang" />
          </Form.Item>
          <Form.Item name="tanggalTebar" label="Tanggal Tebar Benih" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="estimasiPanen" label="Perkiraan Tanggal Panen" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="luasLahan" label="Luas Lahan (Hektar)" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <Input type="number" step="0.1" placeholder="Contoh: 1.5" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Ajukan Penjualan ke Tengkulak" open={isSellModalVisible} onOk={handleSellSubmit} onCancel={() => setIsSellModalVisible(false)} okText="Kirim Pengajuan">
        <Form form={sellForm} layout="vertical">
          <Form.Item name="tengkulak" label="Pilih Tengkulak" rules={[{ required: true, message: 'Wajib pilih tengkulak' }]}>
            <Select placeholder="Pilih Tengkulak Tujuan">
              {tengkulakList.map(tk => (
                <Option key={tk.id} value={tk.id}>{tk.name} ({tk.email})</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="estimatedQty" label="Kuantitas Panen Aktual (Ton)" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <Input type="number" step="0.1" placeholder="Contoh: 5" />
          </Form.Item>
          <Form.Item name="proposedPrice" label="Harga Penawaran / Kg (Rp)" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <Input type="number" placeholder="Contoh: 5500" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default ManagePadi;
