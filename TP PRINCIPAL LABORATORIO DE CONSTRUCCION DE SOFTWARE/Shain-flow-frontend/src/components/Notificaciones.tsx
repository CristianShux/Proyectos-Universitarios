import './estilos/notificaciones.css';

const Notificaciones = () => {
  const notificaciones = [
    {
      mensaje: 'Usted ha realizado su entrega en la tarea TP 4 [NoSQL - Cassandra] diseño',
      tiempo: 'hace 1 día 15 horas',
    },
    {
      mensaje: 'Francisco Simon Orozco De La Hoz ha hecho un comentario en la tarea Entrega Reunión Formal 2',
      tiempo: 'hace 3 días 20 horas',
    },
  ];

  return (
    <div className="notificaciones-container">
     <div className="header">
      <h1>Notificaciones</h1>
      <div className="campana-contenedor">
        <span className="bell-icon">🔔</span>
        <span className="contador">1</span>
      </div>
    </div>

      <div className="notificaciones-lista">
        {notificaciones.map((n, i) => (
          <div key={i} className="notificacion">
            <span className="notificacion-icono">📘</span>
            <div className="notificacion-contenido">
              <p className="mensaje">{n.mensaje}</p>
              <p className="tiempo">{n.tiempo}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ver-todo">
        <button>Ver todo</button>
      </div>
    </div>
  );
};

export default Notificaciones;
