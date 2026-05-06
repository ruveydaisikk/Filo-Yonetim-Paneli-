import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5201/api/vehicles";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #1c1c1e;
    color: #f2f2f2;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 32px;
    overflow: hidden;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    margin-bottom: 48px;
    padding-bottom: 24px;
    border-bottom: 1px solid #3a3a3c;
  }

  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
  }

  .header h1 span { color: #ff6b00; }

  .badge {
    background: #2c2c2e;
    border: 1px solid #3a3a3c;
    color: #ff6b00;
    font-size: 0.75rem;
    padding: 6px 14px;
    border-radius: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .card {
    background: #2c2c2e;
    border: 1px solid #3a3a3c;
    border-radius: 14px;
    padding: 28px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

.card-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0px;
    text-transform: none;
    color: #ff6b00;
    margin-bottom: 20px;
  }
  .btn {
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    padding: 10px 20px;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .btn-primary { background: #ff6b00; color: #fff; }
  .btn-primary:hover { background: #e55f00; transform: translateY(-1px); }
  .btn-secondary { background: #3a3a3c; border: 1px solid #48484a; color: #e0e0e0; }
  .btn-secondary:hover { background: #48484a; color: #fff; }
  .btn-danger { background: #3a1c1c; border: 1px solid #7a3030; color: #ff6b6b; }
  .btn-danger:hover { background: #4a2020; }
  .btn-success { background: #1c3a2a; border: 1px solid #2a6a4a; color: #4ade80; }
  .btn-success:hover { background: #254d38; }
  .btn-sm { padding: 6px 14px; font-size: 0.82rem; border-radius: 7px; }

  .filter-row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-row label { color: #8e8e93; font-size: 0.82rem; font-weight: 500; }

  .filter-row input, .filter-row select {
    background: #1c1c1e;
    border: 1px solid #48484a;
    border-radius: 8px;
    color: #f2f2f2;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    padding: 9px 13px;
    outline: none;
    transition: border-color 0.2s;
  }

  .filter-row input:focus, .filter-row select:focus { border-color: #ff6b00; }
  .filter-row select option { background: #2c2c2e; }
.filter-row input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1) sepia(1) saturate(5) hue-rotate(175deg);
    cursor: pointer;
    opacity: 0.8;
  }
  .error-msg { color: #ff6b6b; font-size: 0.72rem; padding-left: 4px; margin-top: 3px; }
  .input-error { border-color: #ff6b6b !important; }

  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  thead tr { border-bottom: 1px solid #3a3a3c; }

  th {
    color: #8e8e93;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 10px 16px;
    text-align: left;
    text-transform: uppercase;
  }

  td {
    border-bottom: 1px solid #3a3a3c;
    color: #e0e0e0;
    padding: 14px 16px;
    text-align: left;
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #333335; }

  .plate {
    background: #1c1c1e;
    border: 1px solid #48484a;
    border-radius: 6px;
    color: #f2f2f2;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px 12px;
    font-family: 'Syne', sans-serif;
  }

  .type-badge {
    background: #3a2a1c;
    border-radius: 6px;
    color: #ff9a4d;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 3px 10px;
  }

  .actions { display: flex; gap: 8px; }
  .empty { color: #636366; font-size: 0.9rem; padding: 32px 0; text-align: center; }

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .count-chip {
    background: #3a2a1c;
    border: 1px solid #ff6b00;
    border-radius: 20px;
    color: #ff9a4d;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 4px 14px;
  }
`;

export default function App() {
    const [vehicles, setVehicles] = useState([]);
    const [deletedVehicles, setDeletedVehicles] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [report, setReport] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [form, setForm] = useState({ name: "", plateNumber: "", type: "", lastMaintenanceDate: "" });
    const [errors, setErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const [reportFilter, setReportFilter] = useState({ startDate: "", endDate: "", sortBy: "date" });

    useEffect(() => { fetchVehicles(); }, []);

    const fetchVehicles = async () => {
        const res = await axios.get(API);
        setVehicles(res.data);
    };

    const fetchDeleted = async () => {
        const res = await axios.get(`${API}/deleted`);
        setDeletedVehicles(res.data);
        setShowDeleted(true);
    };

    const handleRestore = async (id) => {
        await axios.patch(`${API}/${id}/restore`);
        fetchDeleted();
        fetchVehicles();
    };

    const fetchReport = async () => {
        const params = {};
        if (reportFilter.startDate) params.startDate = reportFilter.startDate;
        if (reportFilter.endDate) params.endDate = reportFilter.endDate;
        if (reportFilter.sortBy) params.sortBy = reportFilter.sortBy;
        const res = await axios.get(`${API}/report`, { params });
        setReport(res.data);
        setShowReport(true);
    };

    const exportCSV = () => {
        if (report.length === 0) return;
        const headers = ["Araç Adı", "Plaka", "Tür", "Son Bakım"];
        const rows = report.map(v => [v.name, v.plateNumber, v.type, v.lastMaintenanceDate?.slice(0, 10) || "-"]);
        const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bakim_raporu.csv";
        a.click();
    };

    const validate = () => {
        const e = {};
        if (!form.name || form.name.length < 2) e.name = "En az 2 karakter";
        if (!form.plateNumber) e.plateNumber = "Zorunlu";
        if (!form.type) e.type = "Zorunlu";
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setErrors({});
        if (editId) {
            await axios.put(`${API}/${editId}`, form);
            setEditId(null);
        } else {
            await axios.post(API, form);
        }
        setForm({ name: "", plateNumber: "", type: "", lastMaintenanceDate: "" });
        fetchVehicles();
    };

    const handleEdit = (v) => {
        setEditId(v.id);
        setErrors({});
        setForm({ name: v.name, plateNumber: v.plateNumber, type: v.type, lastMaintenanceDate: v.lastMaintenanceDate?.slice(0, 10) || "" });
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API}/${id}`);
        fetchVehicles();
    };

    return (
        <>
            <style>{styles}</style>
            <div className="app">
                <div className="header">
                    <div></div>
                    <h1>Filo <span>Yönetim</span> Paneli</h1>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <span className="badge">{vehicles.length} Araç</span>
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">{editId ? "Aracı Düzenle" : "Yeni Araç Ekle"}</div>
                    <div className="filter-row">
                        <div>
                            <input className={errors.name ? "input-error" : ""} placeholder="Araç Adı" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            {errors.name && <div className="error-msg">{errors.name}</div>}
                        </div>
                        <div>
                            <input className={errors.plateNumber ? "input-error" : ""} placeholder="Plaka" value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value })} />
                            {errors.plateNumber && <div className="error-msg">{errors.plateNumber}</div>}
                        </div>
                        <div>
                            <input className={errors.type ? "input-error" : ""} placeholder="Tür (SUV, Kamyon...)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
                            {errors.type && <div className="error-msg">{errors.type}</div>}
                        </div>
                        <input type="date" value={form.lastMaintenanceDate} onChange={e => setForm({ ...form, lastMaintenanceDate: e.target.value })} />
                        <button className="btn btn-primary" onClick={handleSubmit}>{editId ? "Güncelle" : "Ekle"}</button>
                        {editId && <button className="btn btn-secondary" onClick={() => { setEditId(null); setErrors({}); setForm({ name: "", plateNumber: "", type: "", lastMaintenanceDate: "" }); }}>İptal</button>}
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">Bakım Raporu</div>
                    <div className="filter-row">
                        <label>Başlangıç</label>
                        <input type="date" value={reportFilter.startDate} onChange={e => setReportFilter({ ...reportFilter, startDate: e.target.value })} />
                        <label>Bitiş</label>
                        <input type="date" value={reportFilter.endDate} onChange={e => setReportFilter({ ...reportFilter, endDate: e.target.value })} />
                        <label>Sırala</label>
                        <select value={reportFilter.sortBy} onChange={e => setReportFilter({ ...reportFilter, sortBy: e.target.value })}>
                            <option value="date">Son Bakım</option>
                            <option value="name">Araç Adı</option>
                            <option value="plate">Plaka</option>
                            <option value="type">Tür</option>
                        </select>
                        <button className="btn btn-primary btn-sm" onClick={fetchReport}>Raporu Getir</button>
                        {showReport && <button className="btn btn-secondary btn-sm" onClick={exportCSV}>CSV İndir</button>}
                        {showReport && <button className="btn btn-secondary btn-sm" onClick={() => setShowReport(false)}>Kapat</button>}
                    </div>
                    {showReport && (
                        <div style={{ marginTop: 24 }}>
                            <div className="report-header">
                                <span style={{ color: "#8e8e93", fontSize: "0.85rem" }}>Sonuçlar</span>
                                <span className="count-chip">{report.length} araç</span>
                            </div>
                            {report.length === 0 ? (
                                <div className="empty">Bu tarih aralığında bakım yapılan araç bulunamadı.</div>
                            ) : (
                                <table>
                                    <thead><tr><th>Araç Adı</th><th>Plaka</th><th>Tür</th><th>Son Bakım</th></tr></thead>
                                    <tbody>
                                        {report.map(v => (
                                            <tr key={v.id}>
                                                <td>{v.name}</td>
                                                <td><span className="plate">{v.plateNumber}</span></td>
                                                <td><span className="type-badge">{v.type}</span></td>
                                                <td>{v.lastMaintenanceDate?.slice(0, 10)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>

                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="card-title" style={{ marginBottom: 0 }}>Silinen Araçlar</div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-secondary btn-sm" onClick={fetchDeleted}>Göster</button>
                            {showDeleted && <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleted(false)}>Kapat</button>}
                        </div>
                    </div>
                    {showDeleted && (
                        <div style={{ marginTop: 20 }}>
                            {deletedVehicles.length === 0 ? (
                                <div className="empty">Silinmiş araç yok.</div>
                            ) : (
                                <table>
                                    <thead><tr><th>Araç Adı</th><th>Plaka</th><th>Tür</th><th>Son Bakım</th><th>İşlem</th></tr></thead>
                                    <tbody>
                                        {deletedVehicles.map(v => (
                                            <tr key={v.id}>
                                                <td style={{ color: "#636366" }}>{v.name}</td>
                                                <td><span className="plate" style={{ opacity: 0.5 }}>{v.plateNumber}</span></td>
                                                <td><span style={{ color: "#636366", fontSize: "0.85rem" }}>{v.type}</span></td>
                                                <td style={{ color: "#636366" }}>{v.lastMaintenanceDate?.slice(0, 10) || "—"}</td>
                                                <td><button className="btn btn-success btn-sm" onClick={() => handleRestore(v.id)}>Geri Yükle</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-title">Tüm Araçlar</div>
                    {vehicles.length === 0 ? (
                        <div className="empty">Henüz araç eklenmedi.</div>
                    ) : (
                        <table>
                            <thead><tr><th>Araç Adı</th><th>Plaka</th><th>Tür</th><th>Son Bakım</th><th>İşlemler</th></tr></thead>
                            <tbody>
                                {vehicles.map(v => (
                                    <tr key={v.id}>
                                        <td style={{ color: "#fff", fontWeight: 500 }}>{v.name}</td>
                                        <td><span className="plate">{v.plateNumber}</span></td>
                                        <td><span className="type-badge">{v.type}</span></td>
                                        <td>{v.lastMaintenanceDate?.slice(0, 10) || <span style={{ color: "#48484a" }}>—</span>}</td>
                                        <td>
                                            <div className="actions">
                                                <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(v)}>Düzenle</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id)}>Sil</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}