"use client";
import styles from './Pkg.module.css';
import { useEffect, useState } from 'react';

export default function PkgPage() {
  const [formVisible, setFormVisible] = useState(false);
  const [pkgs, setPkgs] = useState([]);
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [msg, setMsg] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchPkgs = async () => {
    try {
      const res = await fetch('/api/pkg');
      const data = await res.json();

      // Pastikan data adalah array
      if (Array.isArray(data)) {
    
        setPkgs(data);
      } else {
        console.error('Data bukan array:', data);
        setPkgs([]);
        setMsg('Gagal memuat data paket.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setPkgs([]);
      setMsg('Terjadi kesalahan saat mengambil data.');
    }
  };

  useEffect(() => {
    fetchPkgs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch('/api/pkg', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, kode, nama, deskripsi }),
    });

    if (res.ok) {
      setMsg('Data berhasil disimpan!');
      setKode('');
      setNama('');
      setDeskripsi('');
      setEditId(null);
      setFormVisible(false);
      fetchPkgs();
    } else {
      const err = await res.json();
      setMsg(`Gagal menyimpan: ${err.error}`);
    }
  };

  const handleEdit = (item) => {
    setKode(item.kode);
    setNama(item.nama);
    setDeskripsi(item.deskripsi);
    setEditId(item.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    await fetch('/api/pkg', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchPkgs();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manajemen Paket</h1>
      <button
        className={styles.buttonToggle}
        onClick={() => {
          setFormVisible(!formVisible);
          setMsg('');
        }}>
        {formVisible ? 'Tutup Form' : 'Tambah Paket'}
      </button>

      {formVisible && (
        <div className={styles.formWrapper}>
          <h3>{editId ? 'Edit Paket' : 'Input Paket Baru'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <span>Kode Paket</span>
              <input
                type="text"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="Contoh: PKT01"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>Nama Paket</span>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan Nama Paket"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <span>Deskripsi</span>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi Paket"
                required
              ></textarea>
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
              <th>Kode</th>
              <th>Nama Paket</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pkgs) && pkgs.length > 0 ? (
              pkgs.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.kode}</td>
                  <td>{item.nama}</td>
                  <td>{item.deskripsi}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Tidak ada data paket.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
