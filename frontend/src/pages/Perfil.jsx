import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';

function Perfil() {
  const navigate = useNavigate();

  // Estado del perfil (Carnet fijo y no editable)
  const [datosPerfil, setDatosPerfil] = useState({
    carnet: '202100123',
    correo: 'estudiante@ingenieria.usac.edu.gt',
    nombres: '',
    apellidos: ''
  });

  // Estado de cursos aprobados con sus créditos
  const [cursosAprobados] = useState([
    { id: 1, codigo: '0770', nombre: 'Introducción a la Programación y Computación 1', creditos: 4, semestre: '1er Semestre 2024' },
    { id: 2, codigo: '0771', nombre: 'Introducción a la Programación y Computación 2', creditos: 5, semestre: '2do Semestre 2024' },
    { id: 3, codigo: '0960', nombre: 'Matemática para Computación 1', creditos: 5, semestre: '1er Semestre 2024' }
  ]);

  // Estado de búsqueda por carnet
  const [busquedaCarnet, setBusquedaCarnet] = useState('');
  const [usuarioBuscado, setUsuarioBuscado] = useState(null);

  // Estado para la alerta visual de guardado
  const [mensajeGuardado, setMensajeGuardado] = useState(false);

  // Suma acumulada de créditos aprobados
  const totalCreditos = cursosAprobados.reduce((acc, c) => acc + c.creditos, 0);

  // Acción directa al presionar Guardar cambios
  const handleGuardar = () => {
    setMensajeGuardado(true);
    setTimeout(() => {
      setMensajeGuardado(false);
    }, 3000);
  };

  // Acción de búsqueda de usuario por carnet
  const handleBuscar = (e) => {
    e.preventDefault();
    if (busquedaCarnet.trim()) {
      setUsuarioBuscado({
        nombres: 'Carlos René Martínez López',
        carnet: busquedaCarnet,
        creditos: 48,
        opiniones: 3
      });
    }
  };

  // Salir de la aplicación
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="inicio-page">
      {/* Header Institucional */}
      <header className="inicio-header">
        <div className="header-brand">
          <div className="header-logo">FI</div>
          <div>
            <h1>Foro Ingenieria</h1>
            <p>Facultad de Ingenieria - USAC</p>
          </div>
        </div>
        <div className="header-user">
          <span>Hola, {datosPerfil.nombres || 'Estudiante'}</span>
          <button type="button" className="logout-button" onClick={cerrarSesion}>
            Cerrar sesion
          </button>
        </div>
      </header>

      <main className="inicio-container">
        <section className="inicio-intro">
          <h2>Mi Perfil Académico</h2>
          <p>Gestiona tu información personal, consulta tu historial de cursos y busca otros estudiantes.</p>
        </section>

        {/* Módulo 4: Perfil Propio */}
        <section className="filtros-panel" style={{ marginBottom: '24px' }}>
          <h3>Datos del Estudiante</h3>
          <div className="filtros-grid" style={{ marginTop: '16px' }}>
            <div className="filtro-grupo">
              <label>Registro académico / Carnet (No editable)</label>
              <input 
                type="text" 
                value={datosPerfil.carnet} 
                readOnly 
                disabled 
                style={{ 
                  backgroundColor: '#edf2f7', 
                  color: '#4a5568', 
                  cursor: 'not-allowed',
                  border: '1px solid #cbd5e0' 
                }} 
              />
            </div>
            <div className="filtro-grupo">
              <label>Correo electrónico</label>
              <input 
                type="email" 
                value={datosPerfil.correo} 
                onChange={(e) => setDatosPerfil({ ...datosPerfil, correo: e.target.value })} 
              />
            </div>
            <div className="filtro-grupo">
              <label>Nombres</label>
              <input 
                type="text" 
                value={datosPerfil.nombres} 
                onChange={(e) => setDatosPerfil({ ...datosPerfil, nombres: e.target.value })} 
              />
            </div>
            <div className="filtro-grupo">
              <label>Apellidos</label>
              <input 
                type="text" 
                value={datosPerfil.apellidos} 
                onChange={(e) => setDatosPerfil({ ...datosPerfil, apellidos: e.target.value })} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '16px' }}>
            <button 
              type="button" 
              className="limpiar-button" 
              style={{ background: '#1c3b70', color: '#fff', cursor: 'pointer' }}
              onClick={handleGuardar}
            >
              Guardar cambios
            </button>
            {mensajeGuardado && (
              <span style={{ color: '#22543d', background: '#c6f6d5', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                ✓ Datos actualizados correctamente
              </span>
            )}
          </div>
        </section>

        {/* Módulo 5: Cursos Aprobados y Créditos */}
        <section className="filtros-panel" style={{ marginBottom: '24px' }}>
          <h3>Control de Cursos Aprobados</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '14px', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#edf2f7', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Código</th>
                <th style={{ padding: '10px' }}>Nombre del Curso</th>
                <th style={{ padding: '10px' }}>Créditos</th>
                <th style={{ padding: '10px' }}>Semestre</th>
              </tr>
            </thead>
            <tbody>
              {cursosAprobados.map((curso) => (
                <tr key={curso.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px' }}>{curso.codigo}</td>
                  <td style={{ padding: '10px' }}>{curso.nombre}</td>
                  <td style={{ padding: '10px' }}>{curso.creditos}</td>
                  <td style={{ padding: '10px' }}>{curso.semestre}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '16px', display: 'inline-block', background: '#e6fffa', color: '#234e52', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold' }}>
            Total acumulado: {totalCreditos} créditos
          </div>
        </section>

        {/* Módulo 6: Buscar Estudiante por Carnet */}
        <section className="filtros-panel">
          <h3>Buscar Estudiante por Carnet</h3>
          <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '10px', marginTop: '14px', marginBottom: '14px' }}>
            <input 
              type="text" 
              placeholder="Ingresa carnet (Ej. 202009876)" 
              value={busquedaCarnet} 
              onChange={(e) => setBusquedaCarnet(e.target.value)}
              style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e0', borderRadius: '6px' }} 
            />
            <button type="submit" className="limpiar-button" style={{ background: '#1c3b70', color: '#fff', cursor: 'pointer' }}>
              Consultar
            </button>
          </form>

          {usuarioBuscado && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px' }}>
              <p style={{ fontWeight: 'bold', color: '#2d3748' }}>{usuarioBuscado.nombres}</p>
              <p style={{ fontSize: '12px', color: '#718096' }}>
                Carnet: {usuarioBuscado.carnet} | Créditos acumulados: {usuarioBuscado.creditos} | Opiniones: {usuarioBuscado.opiniones}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Perfil;