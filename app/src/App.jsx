import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { QrCode, LayoutDashboard, Users, Download, Sparkles, Activity, PieChart as PieIcon, LogOut, CheckCircle2, Smartphone, Monitor, Lock, User as UserIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Scanner } from '@yudiel/react-qr-scanner';
import './index.css';

const initialDataset = [
  { id: 1, name: "Carlos M.", age: 24, city: "Santa Cruz", attendance: "Si", interactions: 3, nps: 5, product: "Coca-Cola Zero", conversion: "Si", channel: "App", time: "10:15 AM" },
  { id: 2, name: "Ana L.", age: 30, city: "La Paz", attendance: "Si", interactions: 1, nps: 4, product: "Coca-Cola Original", conversion: "No", channel: "Web", time: "10:30 AM" },
  { id: 3, name: "Luis P.", age: 19, city: "Cochabamba", attendance: "Si", interactions: 4, nps: 5, product: "Sprite", conversion: "Si", channel: "Redes", time: "11:00 AM" },
  { id: 4, name: "María G.", age: 22, city: "Santa Cruz", attendance: "Si", interactions: 2, nps: 4, product: "Coca-Cola Zero", conversion: "Si", channel: "App", time: "11:15 AM" },
];

function App() {
  const [appMode, setAppMode] = useState(null); // null = landing, 'user' = mobile, 'login' = login admin, 'admin' = dashboard
  const [attendees, setAttendees] = useState(initialDataset);
  const [feed, setFeed] = useState([
    { id: 1, user: "Carlos M.", action: "Ingreso Exitoso", time: "10:15 AM" }
  ]);

  const processCheckIn = (name, product, method = "QR") => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const newAttendee = {
      id: Date.now(),
      name: name || "Invitado Especial",
      age: Math.floor(Math.random() * 15) + 18,
      city: "Sede Central",
      attendance: "Si",
      interactions: 1,
      nps: 5,
      product: product,
      conversion: "Si",
      channel: method,
      time: timeStr
    };

    setAttendees(prev => [newAttendee, ...prev]);
    setFeed(prev => [
      { id: Date.now(), user: newAttendee.name, action: `Ingreso con ${product}`, time: timeStr },
      ...prev
    ]);
  };

  // 1. LANDING PAGE
  if (!appMode) {
    return (
      <div className="role-selector fade-in">
        <div style={{width: '100%', textAlign: 'center', marginBottom: '20px'}}>
          <div className="logo-dot" style={{margin: '0 auto 20px auto', width: '20px', height: '20px'}}></div>
          <h1 style={{color: 'white', fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px'}}>Coca-Cola Intelligence</h1>
          <p style={{color: 'var(--cc-text-muted)', fontSize: '1.2rem', marginTop: '10px'}}>Plataforma Inteligente de Eventos Especiales</p>
        </div>
        
        <div className="role-card" onClick={() => setAppMode('user')}>
          <Smartphone size={50} color="white" style={{marginBottom: '24px', background: 'var(--cc-red)', padding: '12px', borderRadius: '16px'}} />
          <h2 style={{color: 'white', fontSize: '1.8rem', marginBottom: '12px'}}>Vista Asistente</h2>
          <p style={{color: 'var(--cc-text-muted)', lineHeight: '1.5'}}>Experiencia móvil inmersiva. Genera un ticket QR en segundos.</p>
        </div>

        <div className="role-card" onClick={() => setAppMode('login')}>
          <Monitor size={50} color="black" style={{marginBottom: '24px', background: 'var(--cc-accent)', padding: '12px', borderRadius: '16px'}} />
          <h2 style={{color: 'white', fontSize: '1.8rem', marginBottom: '12px'}}>Vista Admin</h2>
          <p style={{color: 'var(--cc-text-muted)', lineHeight: '1.5'}}>Dashboard analítico con IA, cámara de control y exportación BI.</p>
        </div>
      </div>
    );
  }

  // 2. USER APP
  if (appMode === 'user') {
    return <UserApp goBack={() => setAppMode(null)} />;
  }

  // 3. ADMIN LOGIN
  if (appMode === 'login') {
    return <AdminLogin onLogin={() => setAppMode('admin')} goBack={() => setAppMode(null)} />;
  }

  // 4. ADMIN DASHBOARD
  if (appMode === 'admin') {
    return <AdminApp attendees={attendees} feed={feed} processCheckIn={processCheckIn} goBack={() => setAppMode(null)} />;
  }
}

// ==========================================
// ADMIN LOGIN COMPONENT
// ==========================================
const AdminLogin = ({ onLogin, goBack }) => {
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = e.target.user.value;
    const pass = e.target.password.value;
    // Simple mock authentication
    if (user === 'admin' && pass === '1234') {
      onLogin();
    } else {
      setError('Credenciales incorrectas. (Pista: admin / 1234)');
    }
  };

  return (
    <div className="user-app fade-in" style={{justifyContent: 'center'}}>
      <button onClick={goBack} style={{position: 'absolute', top: '30px', left: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', backdropFilter: 'blur(10px)', zIndex: 100, fontWeight: 600}}>
        ← Volver
      </button>

      <div className="user-card fade-in" style={{textAlign: 'center', padding: '50px 40px'}}>
        <Lock size={50} color="var(--cc-accent)" style={{marginBottom: '20px', margin: '0 auto'}} />
        <h2 style={{color: 'white', fontSize: '2rem', marginBottom: '10px'}}>Acceso Restringido</h2>
        <p style={{color: 'var(--cc-text-muted)', marginBottom: '30px'}}>Portal de Administración Coca-Cola</p>

        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left'}}>
          <div>
            <label style={{color: 'var(--cc-text-muted)', fontSize: '0.9rem', marginLeft: '10px'}}>Usuario</label>
            <div style={{position: 'relative'}}>
              <UserIcon size={20} color="#888" style={{position: 'absolute', top: '18px', left: '16px'}} />
              <input type="text" name="user" required className="form-input" style={{paddingLeft: '45px'}} placeholder="Ingresa 'admin'" />
            </div>
          </div>
          
          <div>
            <label style={{color: 'var(--cc-text-muted)', fontSize: '0.9rem', marginLeft: '10px'}}>Contraseña</label>
            <div style={{position: 'relative'}}>
              <Lock size={20} color="#888" style={{position: 'absolute', top: '18px', left: '16px'}} />
              <input type="password" name="password" required className="form-input" style={{paddingLeft: '45px'}} placeholder="Ingresa '1234'" />
            </div>
          </div>

          {error && <p style={{color: 'var(--cc-red)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold'}}>{error}</p>}

          <button type="submit" className="action-btn" style={{marginTop: '10px', background: 'var(--cc-accent)', color: 'black', boxShadow: '0 8px 30px rgba(242, 200, 17, 0.3)'}}>
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// USER APP (Mobile Experience)
// ==========================================
const UserApp = ({ goBack }) => {
  const [ticket, setTicket] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const product = e.target.product.value;
    const ticketData = JSON.stringify({ name, product });
    setTicket(ticketData);
  };

  return (
    <div className="user-app fade-in">
      <div className="coke-blob"></div>
      <button onClick={goBack} style={{position: 'absolute', top: '30px', left: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', backdropFilter: 'blur(10px)', zIndex: 100, fontWeight: 600}}>
        ← Salir
      </button>
      
      <div style={{zIndex: 1, marginBottom: '40px', marginTop: '60px', textAlign: 'center'}}>
        <h1 style={{color: 'white', fontSize: '3rem', fontWeight: 800, letterSpacing: '4px'}}>COKE<br/>STUDIO</h1>
        <p style={{color: 'var(--cc-red)', fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '6px', marginTop: '10px'}}>FESTIVAL 2026</p>
      </div>

      {!ticket ? (
        <div className="user-card fade-in">
          <h2 style={{marginBottom: '10px', color: 'white', fontSize: '1.8rem'}}>Tu Pase VIP</h2>
          <p style={{color: 'var(--cc-text-muted)', marginBottom: '30px'}}>Obtén tu código de acceso rápido y una bebida de cortesía al entrar.</p>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <input type="text" name="name" placeholder="Tu Nombre Completo" required className="form-input" />
            <select name="product" className="form-input" style={{color: 'white'}}>
              <option value="Coca-Cola Zero">Coca-Cola Zero</option>
              <option value="Coca-Cola Original">Coca-Cola Original</option>
              <option value="Sprite">Sprite</option>
              <option value="Fanta">Fanta</option>
            </select>
            <button type="submit" className="action-btn" style={{marginTop: '10px'}}>Generar Ticket</button>
          </form>
        </div>
      ) : (
        <div className="user-card fade-in" style={{textAlign: 'center'}}>
          <CheckCircle2 size={60} color="#4ade80" style={{margin: '0 auto 20px auto'}} />
          <h2 style={{color: 'white', marginBottom: '10px', fontSize: '1.8rem'}}>¡Estás Listo!</h2>
          <p style={{color: 'var(--cc-text-muted)', marginBottom: '30px'}}>Muestra este código al personal de la entrada.</p>
          <div style={{background: 'white', padding: '24px', borderRadius: '24px', display: 'inline-block', marginBottom: '30px', boxShadow: '0 10px 30px rgba(255,255,255,0.1)'}}>
            <QRCodeSVG value={ticket} size={200} level="H" />
          </div>
          <h3 style={{fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '5px'}}>{JSON.parse(ticket).name}</h3>
          <p style={{color: 'var(--cc-red)', fontWeight: 600, fontSize: '1.2rem'}}>{JSON.parse(ticket).product}</p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// ADMIN APP (Desktop Dashboard)
// ==========================================
const AdminApp = ({ attendees, feed, processCheckIn, goBack }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (currentView !== 'scanner') setIsScanning(false);
    else setIsScanning(true);
  }, [currentView]);

  const stats = useMemo(() => {
    const present = attendees.filter(a => a.attendance === "Si");
    const totalInteractions = present.reduce((sum, a) => sum + a.interactions, 0);
    const totalConversions = present.filter(a => a.conversion === "Si").length;
    const avgNps = present.length ? (present.reduce((sum, a) => sum + a.nps, 0) / present.length).toFixed(1) : 0;
    
    const productCounts = {};
    present.forEach(a => { productCounts[a.product] = (productCounts[a.product] || 0) + 1; });
    const productData = Object.keys(productCounts).map(k => ({ name: k, value: productCounts[k] }));

    return { registered: 350, present: present.length, totalInteractions, totalConversions, avgNps, productData };
  }, [attendees]);

  // CRITICAL FIX: To prevent mutating the array Recharts is using to render (which causes the blank screen crash),
  // we copy the array using [...stats.productData] before sorting it.
  const topProduct = [...stats.productData].sort((a,b) => b.value - a.value)[0]?.name || 'Coca-Cola Zero';

  const handleScan = (result) => {
    if (result && result.length > 0 && isScanning) {
      const text = result[0].rawValue;
      setIsScanning(false);
      try {
        const data = JSON.parse(text);
        if (data.name) {
          processCheckIn(data.name, data.product || "Coca-Cola Original", "Cámara Real");
          setScanResult(`¡Acceso Concedido: ${data.name}!`);
        } else { setScanResult(`QR Inválido`); }
      } catch (e) { setScanResult(`Formato QR incorrecto`); }
      
      setTimeout(() => { setScanResult(null); setIsScanning(true); }, 3000);
    }
  };

  const handleManualScan = (e) => {
    e.preventDefault();
    processCheckIn(e.target.name.value, e.target.product.value, "Manual");
    alert(`Ingreso de ${e.target.name.value} procesado exitosamente.`);
    e.target.reset();
  };

  const exportToPowerBI = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Nombre,Edad,Ciudad,Asistencia,Interacciones,NPS,Producto_Favorito,Conversion,Canal_Registro,Hora\n";
    attendees.forEach(a => { csvContent += `${a.id},${a.name},${a.age},${a.city},${a.attendance},${a.interactions},${a.nps},${a.product},${a.conversion},${a.channel},${a.time}\n`; });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `coca_cola_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="layout fade-in">
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-dot" style={{animation: 'pulse 2s infinite'}}></div>
          <h1>COCA-COLA<br/><span style={{color: 'var(--cc-red)'}}>INTELLIGENCE</span></h1>
        </div>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '8px', height: '100%'}}>
          <div className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}><LayoutDashboard size={20} /> Central IA</div>
          <div className={`nav-item ${currentView === 'scanner' ? 'active' : ''}`} onClick={() => setCurrentView('scanner')}><QrCode size={20} /> Puerta / Escáner</div>
          <div className={`nav-item ${currentView === 'attendees' ? 'active' : ''}`} onClick={() => setCurrentView('attendees')}><Users size={20} /> CRM Base de Datos</div>
          
          <div className="nav-item" onClick={goBack} style={{marginTop: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white'}}>
            <LogOut size={20} /> Cerrar Sesión
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p style={{color: "var(--cc-red)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: '2px'}}>LIVE TRACKING • VERCEL EDGE</p>
            <h2 style={{color: 'white', fontWeight: 800, fontSize: '1.6rem'}}>Coke Studio Festival</h2>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{textAlign: "right"}}>
              <p style={{fontSize: "1rem", fontWeight: "700", color: 'white'}}>Panel Admin</p>
              <p style={{fontSize: "0.85rem", color: "var(--cc-success)", fontWeight: 600}}>En línea</p>
            </div>
            <div style={{width: '48px', height: '48px', borderRadius: '50%', background: 'var(--cc-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 0 15px rgba(244,0,9,0.5)'}}>
              CO
            </div>
          </div>
        </header>

        {currentView === 'dashboard' && (
          <div className="dashboard-grid fade-in">
            <div style={{gridColumn: 'span 12', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '10px'}}>
              <div>
                <h2 style={{color: 'white', fontWeight: 800, fontSize: '2rem'}}>Vista General del Evento</h2>
                <p style={{color: 'var(--cc-text-muted)', fontSize: '1.1rem'}}>Datos sincronizados y procesados en tiempo real.</p>
              </div>
              <button onClick={exportToPowerBI} className="powerbi-btn">
                <Download size={20} /> Exportar Dataset (Power BI)
              </button>
            </div>

            <div className="glass-panel metric-card">
              <h3 className="metric-title"><Users size={18} style={{marginRight:'10px'}}/>Asistencia</h3>
              <div className="metric-value">{stats.present}</div>
              <div className="metric-subtitle">De {stats.registered} inscritos ({Math.round((stats.present/stats.registered)*100)}%)</div>
            </div>
            <div className="glass-panel metric-card">
              <h3 className="metric-title"><Activity size={18} style={{marginRight:'10px'}}/>Interacciones</h3>
              <div className="metric-value">{stats.totalInteractions}</div>
              <div className="metric-subtitle">Volumen de actividad</div>
            </div>
            <div className="glass-panel metric-card">
              <h3 className="metric-title"><CheckCircle2 size={18} style={{marginRight:'10px'}}/>Conversiones</h3>
              <div className="metric-value">{stats.totalConversions}</div>
              <div className="metric-subtitle">{(stats.totalConversions/stats.present * 100 || 0).toFixed(1)}% Tasa Efectiva</div>
            </div>
            <div className="glass-panel metric-card">
              <h3 className="metric-title"><Sparkles size={18} style={{marginRight:'10px'}}/>NPS Score</h3>
              <div className="metric-value" style={{color: 'var(--cc-accent)'}}>{stats.avgNps}</div>
              <div className="metric-subtitle">Evaluación en vivo</div>
            </div>

            <div className="glass-panel ai-panel" style={{gridColumn: 'span 12'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                <div style={{background: 'rgba(242, 200, 17, 0.2)', padding: '10px', borderRadius: '12px'}}><Sparkles color="var(--cc-accent)" size={24} /></div>
                <h3 style={{color: 'white', fontSize: '1.4rem', fontWeight: 700}}>Cortex AI Insights</h3>
              </div>
              <p style={{fontSize: '1.15rem', lineHeight: '1.6', color: 'var(--cc-text-muted)'}}>
                <strong style={{color: 'white'}}>Patrón Detectado:</strong> El flujo hacia el producto <strong style={{color: 'var(--cc-red)'}}>{topProduct}</strong> ha incrementado un 42% en la última hora.
                <br/><br/><span style={{color: 'var(--cc-success)', fontWeight: 600, background: 'rgba(74, 222, 128, 0.1)', padding: '8px 16px', borderRadius: '8px'}}>💡 Acción Automática: Notificación push promocional lanzada al segmento de 18-25 años para maximizar conversiones cruzadas.</span>
              </p>
            </div>

            <div className="glass-panel chart-area" style={{gridColumn: 'span 8', minHeight: '400px'}}>
              <h3 className="metric-title" style={{marginBottom: '30px'}}><PieIcon size={18} style={{marginRight:'10px'}}/>Demanda de Producto</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stats.productData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#a0a0a0" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#a0a0a0" axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: 'rgba(0,0,0,0.9)', border: '1px solid var(--cc-red)', borderRadius: '16px'}} />
                  <Bar dataKey="value" fill="var(--cc-red)" radius={[8, 8, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel feed-area" style={{gridColumn: 'span 4'}}>
              <h3 className="metric-title" style={{marginBottom: '20px'}}>Actividad Reciente <span className="logo-dot" style={{marginLeft: 'auto', animation: 'pulse 2s infinite'}}></span></h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '350px'}}>
                {feed.slice(0, 10).map((f) => (
                  <div key={f.id} style={{display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{background: 'rgba(244,0,9,0.1)', padding: '12px', borderRadius: '12px', color: 'var(--cc-red)'}}><Activity size={20} /></div>
                    <div>
                      <h4 style={{color: 'white', fontWeight: 600, fontSize: '1rem'}}>{f.user}</h4>
                      <p style={{color: 'var(--cc-text-muted)', fontSize: '0.85rem'}}>{f.action} • {f.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'scanner' && (
          <div className="dashboard-grid fade-in">
            <div className="glass-panel" style={{gridColumn: 'span 6'}}>
              <h2 style={{color: 'white', marginBottom: '24px', fontSize: '1.8rem'}}>📸 Lente de Control</h2>
              {scanResult ? (
                <div className="fade-in" style={{width: '100%', height: '350px', background: 'rgba(74, 222, 128, 0.1)', border: '2px solid var(--cc-success)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px'}}>
                  <CheckCircle2 size={100} color="var(--cc-success)" style={{marginBottom: '20px'}} />
                  <h3 style={{color: 'var(--cc-success)', fontSize: '1.8rem'}}>{scanResult}</h3>
                </div>
              ) : (
                <div style={{width: '100%', overflow: 'hidden', borderRadius: '24px', border: '2px solid rgba(255,255,255,0.1)', background: '#000', minHeight: '350px', position: 'relative'}}>
                  {isScanning && <Scanner onScan={handleScan} allowMultiple={true} scanDelay={500} components={{ audio: false, finder: true }}/>}
                  <div style={{position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center'}}><span style={{background: 'rgba(0,0,0,0.8)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', color: 'white'}}>Escaneando...</span></div>
                </div>
              )}
            </div>

            <div className="glass-panel" style={{gridColumn: 'span 6'}}>
              <h2 style={{color: 'white', marginBottom: '24px', fontSize: '1.8rem'}}>Ingreso Manual</h2>
              <form onSubmit={handleManualScan} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div>
                  <label style={{color: 'var(--cc-text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '8px'}}>Nombre del Invitado</label>
                  <input type="text" name="name" required className="form-input" placeholder="Escribe aquí..." />
                </div>
                <div>
                  <label style={{color: 'var(--cc-text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '8px'}}>Selección de Bebida</label>
                  <select name="product" className="form-input" style={{color: 'white'}}>
                    <option value="Coca-Cola Zero">Coca-Cola Zero</option>
                    <option value="Coca-Cola Original">Coca-Cola Original</option>
                    <option value="Sprite">Sprite</option>
                    <option value="Fanta">Fanta</option>
                  </select>
                </div>
                <button type="submit" className="action-btn" style={{marginTop: '10px'}}>Registrar Ingreso</button>
              </form>
            </div>
          </div>
        )}

        {currentView === 'attendees' && (
          <div className="dashboard-grid fade-in">
            <div className="glass-panel" style={{gridColumn: 'span 12'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                <h2 style={{color: 'white', fontSize: '1.8rem'}}>Central CRM (Registros)</h2>
                <div style={{background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '16px', fontWeight: 600}}>Total: {attendees.length}</div>
              </div>
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                  <thead><tr style={{borderBottom: '1px solid var(--cc-glass-border)', color: 'var(--cc-text-muted)', fontSize: '0.9rem'}}><th style={{padding: '20px 16px'}}>NOMBRE COMPLETO</th><th style={{padding: '20px 16px'}}>ESTADO</th><th style={{padding: '20px 16px'}}>CANAL INGRESO</th><th style={{padding: '20px 16px'}}>PREFERENCIA</th></tr></thead>
                  <tbody>
                    {attendees.map(a => (
                      <tr key={a.id} style={{borderBottom: '1px solid rgba(255,255,255,0.02)'}} className="table-row-hover">
                        <td style={{padding: '20px 16px', fontWeight: 'bold', color: 'white', fontSize: '1.1rem'}}>{a.name}</td>
                        <td style={{padding: '20px 16px'}}>{a.attendance === 'Si' ? <span style={{color: 'var(--cc-success)', background: 'rgba(74, 222, 128, 0.1)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600}}>Presente ({a.time})</span> : <span style={{color: 'var(--cc-text-muted)'}}>Ausente</span>}</td>
                        <td style={{padding: '20px 16px', color: 'var(--cc-text-muted)'}}>{a.channel}</td>
                        <td style={{padding: '20px 16px', color: 'white', fontWeight: 500}}>{a.product}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
