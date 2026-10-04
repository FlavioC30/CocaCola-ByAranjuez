import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { QrCode, LayoutDashboard, Users, Download, Sparkles, Activity, PieChart as PieIcon, LogOut, CheckCircle2, Smartphone, Monitor, Lock, User as UserIcon, Calendar, MapPin, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Scanner } from '@yudiel/react-qr-scanner';
import './index.css';

const initialDataset = [
  { id: 1, name: "Carlos M.", age: 24, city: "Sede Central", attendance: "Si", interactions: 3, nps: 5, product: "Coca-Cola Zero", conversion: "Si", channel: "App", time: "10:15 AM" },
  { id: 2, name: "Ana L.", age: 30, city: "Sede Central", attendance: "Si", interactions: 1, nps: 4, product: "Coca-Cola Original", conversion: "No", channel: "Web", time: "10:30 AM" },
  { id: 3, name: "Luis P.", age: 19, city: "Sede Central", attendance: "Si", interactions: 4, nps: 5, product: "Sprite", conversion: "Si", channel: "Redes", time: "11:00 AM" },
];

const initialEvents = [
  { 
    id: 1, 
    name: 'Coke Studio Festival 2026', 
    date: 'Hoy (En Vivo)', 
    location: 'Estadio Nacional',
    status: 'live',
    attendees: initialDataset,
    feed: [{ id: 1, user: "Carlos M.", action: "Ingreso Exitoso", time: "10:15 AM" }]
  },
  { 
    id: 2, 
    name: 'Sprite Urbana Fest', 
    date: '15 de Noviembre, 2026', 
    location: 'Parque de la Ciudad',
    status: 'upcoming',
    attendees: [],
    feed: []
  }
];

function App() {
  const [appMode, setAppMode] = useState(null); // null = landing, 'user' = mobile, 'login' = admin login, 'admin' = dashboard
  const [events, setEvents] = useState(initialEvents);

  const processCheckIn = (eventId, name, product, method = "QR") => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          attendees: [
            { id: Date.now(), name: name || "Invitado", age: 22, city: ev.location, attendance: "Si", interactions: 1, nps: 5, product: product, conversion: "Si", channel: method, time: timeStr },
            ...ev.attendees
          ],
          feed: [
            { id: Date.now(), user: name || "Invitado", action: `Ingreso con ${product}`, time: timeStr },
            ...ev.feed
          ]
        };
      }
      return ev;
    }));
  };

  const createEvent = (name, date, location) => {
    const newEvent = { id: Date.now(), name, date, location, status: 'live', attendees: [], feed: [] };
    setEvents([newEvent, ...events]);
  };

  if (!appMode) {
    return (
      <div className="role-selector fade-in">
        <div style={{width: '100%', textAlign: 'center', marginBottom: '20px'}}>
          <div className="logo-dot" style={{margin: '0 auto 20px auto', width: '20px', height: '20px'}}></div>
          <h1 style={{color: 'white', fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px'}}>Coca-Cola Intelligence</h1>
          <p style={{color: 'var(--cc-text-muted)', fontSize: '1.2rem', marginTop: '10px'}}>Plataforma Inteligente de Gestión de Eventos</p>
        </div>
        
        <div className="role-card" onClick={() => setAppMode('user')}>
          <Smartphone size={50} color="white" style={{marginBottom: '24px', background: 'var(--cc-red)', padding: '12px', borderRadius: '16px'}} />
          <h2 style={{color: 'white', fontSize: '1.8rem', marginBottom: '12px'}}>Portal Asistentes</h2>
          <p style={{color: 'var(--cc-text-muted)', lineHeight: '1.5'}}>Descubre eventos vigentes y genera tu Ticket QR al instante.</p>
        </div>

        <div className="role-card" onClick={() => setAppMode('login')}>
          <Monitor size={50} color="black" style={{marginBottom: '24px', background: 'var(--cc-accent)', padding: '12px', borderRadius: '16px'}} />
          <h2 style={{color: 'white', fontSize: '1.8rem', marginBottom: '12px'}}>Portal Organizadores</h2>
          <p style={{color: 'var(--cc-text-muted)', lineHeight: '1.5'}}>Crea eventos, supervisa el control de acceso y analiza métricas.</p>
        </div>
      </div>
    );
  }

  if (appMode === 'user') return <UserApp events={events} onRegister={processCheckIn} goBack={() => setAppMode(null)} />;
  if (appMode === 'login') return <AdminLogin onLogin={() => setAppMode('admin')} goBack={() => setAppMode(null)} />;
  if (appMode === 'admin') return <AdminApp events={events} createEvent={createEvent} processCheckIn={processCheckIn} goBack={() => setAppMode(null)} />;
}

// ==========================================
// ADMIN LOGIN
// ==========================================
const AdminLogin = ({ onLogin, goBack }) => {
  const [error, setError] = useState('');
  const handleLogin = (e) => {
    e.preventDefault();
    if (e.target.user.value === 'admin' && e.target.password.value === '1234') onLogin();
    else setError('Credenciales incorrectas.');
  };

  return (
    <div className="user-app fade-in" style={{justifyContent: 'center'}}>
      <button onClick={goBack} className="back-btn"><ArrowLeft size={18} /> Volver</button>
      <div className="user-card fade-in" style={{textAlign: 'center', padding: '50px 40px'}}>
        <Lock size={50} color="var(--cc-accent)" style={{marginBottom: '20px', margin: '0 auto'}} />
        <h2 style={{color: 'white', fontSize: '2rem', marginBottom: '10px'}}>Acceso Restringido</h2>
        <p style={{color: 'var(--cc-text-muted)', marginBottom: '30px'}}>Sistema Central</p>
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left'}}>
          <div style={{position: 'relative'}}><UserIcon size={20} color="#888" style={{position: 'absolute', top: '18px', left: '16px'}} /><input type="text" name="user" required className="form-input" style={{paddingLeft: '45px'}} placeholder="Usuario (admin)" /></div>
          <div style={{position: 'relative'}}><Lock size={20} color="#888" style={{position: 'absolute', top: '18px', left: '16px'}} /><input type="password" name="password" required className="form-input" style={{paddingLeft: '45px'}} placeholder="Clave (1234)" /></div>
          {error && <p style={{color: 'var(--cc-red)', textAlign: 'center', fontWeight: 'bold'}}>{error}</p>}
          <button type="submit" className="action-btn" style={{background: 'var(--cc-accent)', color: 'black'}}>Ingresar</button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// USER APP (Mobile Event Explorer & Registration)
// ==========================================
const UserApp = ({ events, onRegister, goBack }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticket, setTicket] = useState(null);

  if (!selectedEvent) {
    return (
      <div className="user-app fade-in" style={{justifyContent: 'flex-start', paddingTop: '80px'}}>
        <button onClick={goBack} className="back-btn"><ArrowLeft size={18} /> Salir</button>
        <div style={{width: '100%', maxWidth: '420px', textAlign: 'left'}}>
          <h1 style={{color: 'white', fontSize: '2.5rem', fontWeight: 800}}>Explora<br/>Eventos</h1>
          <p style={{color: 'var(--cc-text-muted)', marginBottom: '30px', fontSize: '1.1rem'}}>Consigue accesos exclusivos.</p>
          
          <h3 style={{color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}><Activity size={18} color="var(--cc-success)" /> En Vivo Ahora</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px'}}>
            {events.filter(e => e.status === 'live').map(e => (
              <div key={e.id} className="glass-panel" onClick={() => setSelectedEvent(e)} style={{cursor: 'pointer', padding: '20px', borderLeft: '4px solid var(--cc-red)'}}>
                <h3 style={{color: 'white', fontSize: '1.4rem'}}>{e.name}</h3>
                <p style={{color: 'var(--cc-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px'}}><Calendar size={14}/> {e.date}</p>
                <p style={{color: 'var(--cc-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px'}}><MapPin size={14}/> {e.location}</p>
                <div style={{marginTop: '16px', color: 'var(--cc-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'}}>Registrarme <ArrowRight size={16} /></div>
              </div>
            ))}
          </div>

          <h3 style={{color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}><Calendar size={18} color="var(--cc-accent)" /> Próximamente</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {events.filter(e => e.status === 'upcoming').map(e => (
              <div key={e.id} className="glass-panel" style={{padding: '20px', opacity: 0.7}}>
                <h3 style={{color: 'white', fontSize: '1.2rem'}}>{e.name}</h3>
                <p style={{color: 'var(--cc-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px'}}><Calendar size={14}/> {e.date}</p>
                <div style={{marginTop: '12px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '12px', display: 'inline-block', fontSize: '0.8rem'}}>Pronto disponible</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const product = e.target.product.value;
    const ticketData = JSON.stringify({ name, product });
    onRegister(selectedEvent.id, name, product, "App Movil");
    setTicket(ticketData);
  };

  return (
    <div className="user-app fade-in">
      <div className="coke-blob"></div>
      <button onClick={() => { setSelectedEvent(null); setTicket(null); }} className="back-btn"><ArrowLeft size={18} /> Volver</button>
      
      <div style={{zIndex: 1, marginBottom: '40px', marginTop: '40px', textAlign: 'center'}}>
        <h1 style={{color: 'white', fontSize: '2rem', fontWeight: 800}}>{selectedEvent.name}</h1>
        <p style={{color: 'var(--cc-red)', fontWeight: 700, fontSize: '1rem', marginTop: '10px'}}>{selectedEvent.location}</p>
      </div>

      {!ticket ? (
        <div className="user-card fade-in">
          <h2 style={{marginBottom: '10px', color: 'white', fontSize: '1.8rem'}}>Tu Pase VIP</h2>
          <p style={{color: 'var(--cc-text-muted)', marginBottom: '30px'}}>Obtén tu código de acceso rápido.</p>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <input type="text" name="name" placeholder="Tu Nombre Completo" required className="form-input" />
            <select name="product" className="form-input" style={{color: 'white'}}>
              <option value="Coca-Cola Zero">Coca-Cola Zero</option>
              <option value="Coca-Cola Original">Coca-Cola Original</option>
              <option value="Sprite">Sprite</option>
            </select>
            <button type="submit" className="action-btn">Generar Ticket</button>
          </form>
        </div>
      ) : (
        <div className="user-card fade-in" style={{textAlign: 'center'}}>
          <CheckCircle2 size={60} color="#4ade80" style={{margin: '0 auto 20px auto'}} />
          <h2 style={{color: 'white', marginBottom: '10px', fontSize: '1.8rem'}}>¡Estás Listo!</h2>
          <div style={{background: 'white', padding: '24px', borderRadius: '24px', display: 'inline-block', marginBottom: '20px'}}>
            <QRCodeSVG value={ticket} size={200} level="H" />
          </div>
          <h3 style={{fontSize: '1.8rem', fontWeight: 800, color: 'white'}}>{JSON.parse(ticket).name}</h3>
        </div>
      )}
    </div>
  );
};

// ==========================================
// ADMIN APP (Multi-Event Dashboard)
// ==========================================
const AdminApp = ({ events, createEvent, processCheckIn, goBack }) => {
  const [activeEventId, setActiveEventId] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    createEvent(e.target.name.value, e.target.date.value, e.target.location.value);
    e.target.reset();
    alert("Evento creado exitosamente.");
  };

  // EVENT SELECTOR VIEW
  if (!activeEventId) {
    return (
      <div className="layout fade-in" style={{background: 'var(--cc-dark)'}}>
        <div style={{padding: '40px', width: '100%', maxWidth: '1200px', margin: '0 auto', overflowY: 'auto'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px'}}>
            <div>
              <h1 style={{color: 'white', fontSize: '2.5rem', fontWeight: 800}}>Mis Eventos</h1>
              <p style={{color: 'var(--cc-text-muted)', fontSize: '1.1rem'}}>Gestor Central de Inteligencia</p>
            </div>
            <button onClick={goBack} className="action-btn" style={{width: 'auto', background: 'rgba(255,255,255,0.1)', color: 'white'}}><LogOut size={18} style={{display:'inline', marginRight:'8px'}}/> Cerrar Sesión</button>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
            {/* Create Event Card */}
            <div className="glass-panel" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed var(--cc-glass-border)', background: 'transparent'}}>
              <h3 style={{color: 'white', marginBottom: '20px'}}>Crear Nuevo Evento</h3>
              <form onSubmit={handleCreate} style={{display: 'flex', flexDirection: 'column', gap: '12px', width: '100%'}}>
                <input type="text" name="name" placeholder="Nombre del Evento" required className="form-input" style={{padding: '12px'}} />
                <input type="text" name="date" placeholder="Fecha (ej: Mañana)" required className="form-input" style={{padding: '12px'}} />
                <input type="text" name="location" placeholder="Ubicación" required className="form-input" style={{padding: '12px'}} />
                <button type="submit" className="action-btn" style={{padding: '12px'}}><Plus size={16} style={{display:'inline'}}/> Crear Evento</button>
              </form>
            </div>

            {/* List Events */}
            {events.map(ev => (
              <div key={ev.id} className="glass-panel" style={{position: 'relative', overflow: 'hidden'}}>
                {ev.status === 'live' && <div style={{position: 'absolute', top: '20px', right: '20px', width: '12px', height: '12px', background: 'var(--cc-success)', borderRadius: '50%', boxShadow: '0 0 10px var(--cc-success)', animation: 'pulse 2s infinite'}}></div>}
                <h2 style={{color: 'white', fontSize: '1.5rem', marginBottom: '10px'}}>{ev.name}</h2>
                <p style={{color: 'var(--cc-text-muted)', marginBottom: '8px'}}><Calendar size={16} style={{display:'inline', verticalAlign:'middle'}}/> {ev.date}</p>
                <p style={{color: 'var(--cc-text-muted)', marginBottom: '24px'}}><MapPin size={16} style={{display:'inline', verticalAlign:'middle'}}/> {ev.location}</p>
                
                <div style={{background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginBottom: '20px'}}>
                  <p style={{color: 'white', fontWeight: 600, fontSize: '1.2rem'}}><Users size={16} style={{display:'inline'}}/> {ev.attendees.length} Registros</p>
                </div>

                <button onClick={() => setActiveEventId(ev.id)} className="action-btn" style={{width: '100%'}}>Ingresar al Panel <ArrowRight size={16} style={{display:'inline', verticalAlign:'middle'}}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // INDIVIDUAL EVENT DASHBOARD
  const currentEvent = events.find(e => e.id === activeEventId);
  const attendees = currentEvent.attendees;
  const feed = currentEvent.feed;

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

    return { registered: attendees.length + 50, present: present.length, totalInteractions, totalConversions, avgNps, productData };
  }, [attendees]);

  const topProduct = [...stats.productData].sort((a,b) => b.value - a.value)[0]?.name || 'Coca-Cola Zero';

  const handleScan = (result) => {
    if (result && result.length > 0 && isScanning) {
      const text = result[0].rawValue;
      setIsScanning(false);
      try {
        const data = JSON.parse(text);
        if (data.name) {
          processCheckIn(currentEvent.id, data.name, data.product || "Coca-Cola Original", "Cámara Real");
          setScanResult(`¡Acceso Concedido: ${data.name}!`);
        } else { setScanResult(`QR Inválido`); }
      } catch (e) { setScanResult(`Formato QR incorrecto`); }
      setTimeout(() => { setScanResult(null); setIsScanning(true); }, 3000);
    }
  };

  const handleManualScan = (e) => {
    e.preventDefault();
    processCheckIn(currentEvent.id, e.target.name.value, e.target.product.value, "Manual");
    alert(`Ingreso procesado exitosamente.`);
    e.target.reset();
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
          
          <div className="nav-item" onClick={() => setActiveEventId(null)} style={{marginTop: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white'}}>
            <ArrowLeft size={20} /> Volver a Eventos
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p style={{color: "var(--cc-red)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: '2px'}}>EVENTO ACTIVO</p>
            <h2 style={{color: 'white', fontWeight: 800, fontSize: '1.6rem'}}>{currentEvent.name}</h2>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{textAlign: "right"}}><p style={{fontSize: "1rem", fontWeight: "700", color: 'white'}}>Panel Admin</p></div>
            <div style={{width: '48px', height: '48px', borderRadius: '50%', background: 'var(--cc-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>CO</div>
          </div>
        </header>

        {currentView === 'dashboard' && (
          <div className="dashboard-grid fade-in">
             <div style={{gridColumn: 'span 12', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '10px'}}>
              <div><h2 style={{color: 'white', fontWeight: 800, fontSize: '2rem'}}>Vista General del Evento</h2></div>
            </div>

            <div className="glass-panel metric-card"><h3 className="metric-title"><Users size={18} style={{marginRight:'10px'}}/>Asistencia</h3><div className="metric-value">{stats.present}</div></div>
            <div className="glass-panel metric-card"><h3 className="metric-title"><Activity size={18} style={{marginRight:'10px'}}/>Interacciones</h3><div className="metric-value">{stats.totalInteractions}</div></div>
            <div className="glass-panel metric-card"><h3 className="metric-title"><CheckCircle2 size={18} style={{marginRight:'10px'}}/>Conversiones</h3><div className="metric-value">{stats.totalConversions}</div></div>
            <div className="glass-panel metric-card"><h3 className="metric-title"><Sparkles size={18} style={{marginRight:'10px'}}/>NPS Score</h3><div className="metric-value" style={{color: 'var(--cc-accent)'}}>{stats.avgNps}</div></div>

            <div className="glass-panel ai-panel" style={{gridColumn: 'span 12'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}><div style={{background: 'rgba(242, 200, 17, 0.2)', padding: '10px', borderRadius: '12px'}}><Sparkles color="var(--cc-accent)" size={24} /></div><h3 style={{color: 'white', fontSize: '1.4rem', fontWeight: 700}}>Cortex AI Insights para {currentEvent.name}</h3></div>
              <p style={{fontSize: '1.15rem', lineHeight: '1.6', color: 'var(--cc-text-muted)'}}><strong style={{color: 'white'}}>Patrón Detectado:</strong> El flujo hacia <strong style={{color: 'var(--cc-red)'}}>{topProduct}</strong> ha incrementado un 42% en la última hora.<br/><br/><span style={{color: 'var(--cc-success)', fontWeight: 600, background: 'rgba(74, 222, 128, 0.1)', padding: '8px 16px', borderRadius: '8px'}}>💡 Acción Automática: Promoción lanzada a los {stats.present} asistentes.</span></p>
            </div>

            <div className="glass-panel chart-area" style={{gridColumn: 'span 8', minHeight: '400px'}}>
              <h3 className="metric-title" style={{marginBottom: '30px'}}><PieIcon size={18} style={{marginRight:'10px'}}/>Demanda de Producto</h3>
              <ResponsiveContainer width="100%" height={320}><BarChart data={stats.productData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="name" stroke="#a0a0a0" axisLine={false} tickLine={false} dy={10} /><YAxis stroke="#a0a0a0" axisLine={false} tickLine={false} dx={-10} /><Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: 'rgba(0,0,0,0.9)', border: '1px solid var(--cc-red)', borderRadius: '16px'}} /><Bar dataKey="value" fill="var(--cc-red)" radius={[8, 8, 0, 0]} barSize={60} /></BarChart></ResponsiveContainer>
            </div>

            <div className="glass-panel feed-area" style={{gridColumn: 'span 4'}}>
              <h3 className="metric-title" style={{marginBottom: '20px'}}>Actividad <span className="logo-dot" style={{marginLeft: 'auto', animation: 'pulse 2s infinite'}}></span></h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '350px'}}>
                {feed.slice(0, 10).map((f) => (
                  <div key={f.id} style={{display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{background: 'rgba(244,0,9,0.1)', padding: '12px', borderRadius: '12px', color: 'var(--cc-red)'}}><Activity size={20} /></div>
                    <div><h4 style={{color: 'white', fontWeight: 600, fontSize: '1rem'}}>{f.user}</h4><p style={{color: 'var(--cc-text-muted)', fontSize: '0.85rem'}}>{f.action} • {f.time}</p></div>
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
                </div>
              )}
            </div>
            <div className="glass-panel" style={{gridColumn: 'span 6'}}>
              <h2 style={{color: 'white', marginBottom: '24px', fontSize: '1.8rem'}}>Ingreso Manual</h2>
              <form onSubmit={handleManualScan} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <input type="text" name="name" required className="form-input" placeholder="Nombre..." />
                <select name="product" className="form-input" style={{color: 'white'}}><option value="Coca-Cola Zero">Coca-Cola Zero</option></select>
                <button type="submit" className="action-btn">Registrar Ingreso</button>
              </form>
            </div>
          </div>
        )}

        {currentView === 'attendees' && (
          <div className="dashboard-grid fade-in">
            <div className="glass-panel" style={{gridColumn: 'span 12'}}>
              <h2 style={{color: 'white', fontSize: '1.8rem', marginBottom: '30px'}}>Central CRM: {currentEvent.name}</h2>
              <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                <thead><tr style={{borderBottom: '1px solid var(--cc-glass-border)', color: 'var(--cc-text-muted)'}}><th>NOMBRE</th><th>ESTADO</th><th>PREFERENCIA</th></tr></thead>
                <tbody>
                  {attendees.map(a => (
                    <tr key={a.id} style={{borderBottom: '1px solid rgba(255,255,255,0.02)'}}>
                      <td style={{padding: '20px 0', color: 'white', fontSize: '1.1rem'}}>{a.name}</td>
                      <td><span style={{color: 'var(--cc-success)', background: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px', borderRadius: '16px'}}>Presente</span></td>
                      <td style={{color: 'white'}}>{a.product}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
