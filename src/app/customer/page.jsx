"use client";
import styles from './CustomerPage.module.css'; // Ganti sesuai path css kamu
import { useEffect, useState } from 'react';

export default function CustomerPage() {
  const [formVisible, setFormVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customer');
      const data = await res.json();

      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        console.error('Data bukan array:', data);
        setCustomers([]);
        setMsg('Gagal memuat data customer.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setCustomers([]);
      setMsg('Terjadi kesalahan saat mengambil data.');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch('/api/customer', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, name, phone, email }),
    });

    if (res.ok) {
      setMsg('Data berhasil disimpan!');
      setName('');
      setPhone('');
      setEmail('');
      setEditId(null);
      setFormVisible(false);
      fetchCustomers();
    } else {
      const err = await res.json();
      setMsg(`Gagal menyimpan: ${err.error}`);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPhone(item.phone);
    setEmail(item.email || '');
    setEditId(item.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    await fetch('/api/customer', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchCustomers();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manajemen Customer</h1>
      <button
        className={styles.buttonToggle}
        onClick={() => {
          setFormVisible(!formVisible);
          setMsg('');
        }}>
        {formVisible ? 'Tutup Form' : 'Tambah Customer'}
      </button>

      {formVisible && (
        <div className={styles.formWrapper}>
          <h3>{editId ? 'Edit Customer' : 'Input Customer Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <span>Nama</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan Nama Customer"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>No. Telepon</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Masukkan No. Telepon"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>Email (Opsional)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
              />
            </div>
            <button type="submit">Simpan</button>
            <p>{msg}</p>
          </form>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Telepon</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(customers) && customers.length > 0 ? (
              customers.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.email || '-'}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Tidak ada data customer.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 