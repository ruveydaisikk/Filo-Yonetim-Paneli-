import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5201/api/vehicles";
const AUTH_API = "http://localhost:5201/api/auth";

axios.interceptors.request.use(config => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

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

  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .login-box {
    width: 100%;
    max-width: 380px;
    position: relative;
    z-index: 1;
  }

  .login-title {
    font-family: 'Brokman Sans Serif', sans-serif;
    font-size: 2.99rem;
    font-weight: 900;
    color: #fff;
    text-align: center;
    margin-bottom: 8px;
    letter-spacing: -1px;
  }

  .login-title span { color: #ff6b00; }

  .login-sub {
    color: #636366;
    font-size: 0.99rem;
    text-align: center;
    margin-bottom: 28px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .input-group input {
    background: #1c1c1e;
    border: 1px solid #48484a;
    border-radius: 8px;
    color: #f2f2f2;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }

  .input-group input:focus { border-color: #ff6b00; }

  .login-error {
  color: #ff6b00;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 8px;
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
    font-family: 'Brokman Sans Serif', sans-serif;
    font-size: 2.8rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: -1px;
    text-align: center;
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

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .username-display {
    color: #ffffff;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.3px;
  }
@keyframes drive {
  0% { transform: translateX(-200px); }
  100% { transform: translateX(calc(100vw + 200px)); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.car-animation {
  position: fixed;
  bottom: 50px;
  left: 0;
  animation: drive 10s linear infinite;
  opacity: 0.6;
  z-index: 0;
}

.wheel-left {
  animation: spin 1s linear infinite;
  transform-origin: 38px 62px;
}

.wheel-right {
  animation: spin 1s linear infinite;
  transform-origin: 112px 62px;
}
`;

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [deletedVehicles, setDeletedVehicles] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [report, setReport] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [form, setForm] = useState({ name: "", plateNumber: "", type: "", lastMaintenanceDate: "" });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [reportFilter, setReportFilter] = useState({ startDate: "", endDate: "", sortBy: "date" });

  useEffect(() => { if (token) fetchVehicles(); }, [token]);

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setLoginError("Lütfen kullanıcı adı ve şifrenizi girin!");
      return;
    }
    try {
      setLoginError("");
      const res = await axios.post(`${AUTH_API}/login`, {
        username: loginForm.username,
        password: loginForm.password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      setToken(res.data.token);
      setRole(res.data.role);
      setUsername(res.data.username);
    } catch {
      setLoginError("Kullanıcı adı/e-posta veya şifre hatalı");
    }
  };

  const handleRegister = async () => {
    if (loginForm.password !== loginForm.confirmPassword) {
      setLoginError("Lütfen geçerli bilgiler giriniz!");
      return;
    }
    if (!loginForm.username || !loginForm.email) {
      setLoginError("Lütfen kullanıcı adı ve e-posta yazın");
      return;
    }
    try {
      setLoginError("");
      await axios.post(`${AUTH_API}/register`, {
        username: loginForm.username,
        email: loginForm.email,
        password: loginForm.password,
        role: loginForm.role
      });
      const res = await axios.post(`${AUTH_API}/login`, {
        username: loginForm.username,
        password: loginForm.password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      setToken(res.data.token);
      setRole(res.data.role);
      setUsername(res.data.username);
    } catch (err) {
      setLoginError("Kayıt başarısız. " + (err.response?.data || "Lütfen bilgileri kontrol edin"));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken("");
    setRole("");
    setUsername("");
    setVehicles([]);
    setLoginForm({ username: "", password: "" });
    setLoginError("");
    setIsRegister(false);
    setShowPassword(false);
  };

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

  const EyeIcon = ({ open }) => open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  if (!token) return (
    <>
      <style>{styles}</style>
      <div className="login-wrap">
        <svg className="car-animation" width="180" height="75" viewBox="0 0 150 75" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="35" width="134" height="28" rx="6" fill="#ff6b00" />
          <rect x="28" y="16" width="82" height="26" rx="8" fill="#ff8c00" />
          <rect x="88" y="20" width="18" height="18" rx="3" fill="#87ceeb" />
          <rect x="34" y="20" width="18" height="18" rx="3" fill="#87ceeb" />
          <rect x="58" y="20" width="24" height="18" rx="3" fill="#87ceeb" />
          <rect x="136" y="38" width="10" height="6" rx="2" fill="#ffe066" />
          <rect x="4" y="38" width="8" height="6" rx="2" fill="#ff3333" />
          <circle cx="38" cy="63" r="12" fill="#222" stroke="#888" strokeWidth="2" />
          <circle cx="38" cy="63" r="5" fill="#555" stroke="#999" strokeWidth="1.5" />
          <circle cx="112" cy="63" r="12" fill="#222" stroke="#888" strokeWidth="2" />
          <circle cx="112" cy="63" r="5" fill="#555" stroke="#999" strokeWidth="1.5" />
        </svg>
        <div className="login-box">
          <div className="login-title">Filo <span>Yönetim</span></div>
          <div className="login-sub">{isRegister ? "Yeni hesap oluştur" : "Devam etmek için giriş yapın"}</div>
          <div className="card">
            <div className="input-group">
              {isRegister && (
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                  <span style={{ color: "#8e8e93", fontSize: "0.78rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>Hesap Oluştur</span>
                </div>
              )}
              {isRegister && (
                <input
                  placeholder="E-posta"
                  type="email"
                  value={loginForm.email || ""}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              )}
              {isRegister && (
                <div style={{ display: "flex", gap: 8 }}>
                  {["User", "Admin"].map(r => (
                    <div
                      key={r}
                      onClick={() => setLoginForm({ ...loginForm, role: r })}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 8,
                        border: `1px solid ${loginForm.role === r || (!loginForm.role && r === "User") ? "#ff6b00" : "#48484a"}`,
                        background: loginForm.role === r || (!loginForm.role && r === "User") ? "#3a1e00" : "#1c1c1e",
                        color: loginForm.role === r || (!loginForm.role && r === "User") ? "#ff6b00" : "#8e8e93",
                        cursor: "pointer", textAlign: "center", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.15s"
                      }}
                    >
                      {r === "User" ? "Standart Kullanıcı" : "Admin"}
                    </div>
                  ))}
                </div>
              )}
              <input
                placeholder="Kullanıcı Adı"
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                onKeyDown={e => e.key === "Enter" && (isRegister ? handleRegister() : handleLogin())}
              />
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifre"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && (isRegister ? handleRegister() : handleLogin())}
                  style={{ paddingRight: 44 }}
                />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#636366", userSelect: "none", display: "flex", alignItems: "center" }}>
                  <EyeIcon open={showPassword} />
                </span>
              </div>
              {isRegister && (
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Şifre Tekrar"
                    value={loginForm.confirmPassword || ""}
                    onChange={e => setLoginForm({ ...loginForm, confirmPassword: e.target.value })}
                    style={{ paddingRight: 44 }}
                  />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#636366", userSelect: "none", display: "flex", alignItems: "center" }}>
                    <EyeIcon open={showConfirmPassword} />
                  </span>
                </div>
              )}
              <button className="btn btn-primary" onClick={isRegister ? handleRegister : handleLogin}>
                {isRegister ? "Hesap Oluştur" : "Giriş Yap"}
              </button>
              {loginError && <div className="login-error">{loginError}</div>}
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <span style={{ color: "#636366", fontSize: "0.9rem" }}>
                  {isRegister ? "Zaten hesabın var mı? " : "Hesabın yok mu? "}
                </span>
                <span
                  onClick={() => { setIsRegister(!isRegister); setLoginError(""); setLoginForm({ username: "", password: "" }); }}
                  style={{ color: "#ff6b00", fontSize: "0.82rem", cursor: "pointer", fontWeight: 600 }}
                >
                  {isRegister ? "Giriş Yap" : "Hesap Oluştur"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="badge">{vehicles.length} Araç</span>
          </div>
          <h1>Filo <span>Yönetim</span> Paneli</h1>
          <div className="user-info">
            <span className="username-display">{username}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Çıkış Yap</button>
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