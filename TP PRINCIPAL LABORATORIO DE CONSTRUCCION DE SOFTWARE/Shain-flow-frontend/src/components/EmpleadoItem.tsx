import { NavLink } from "react-router-dom";
import "./estilos/empleado-item.css";
import type { Empleado } from "../routes/Pantallas/Empleados";
import { useUser } from "../context/UserContext";

export interface EmpleadoItemProps {
  empleado: Empleado;
}

export const EmpleadoItem = ({ empleado }: EmpleadoItemProps) => {
  const { usuario } = useUser();

  return (
    <div className="empleado-item">
      <span className="icono-perfil">
        {empleado.imagen_perfil_url ? (
          <img src={empleado.imagen_perfil_url} alt="" width="50px" />
        ) : (
          <span className="icono-perfil">👤</span>
        )}
      </span>
      <NavLink
        to={`/administrador/enviar-email/${empleado.id_empleado}`}
        className="emoji-correo"
        title="Enviar email"
      >
        📧
      </NavLink>
      <NavLink
        to={`/administrador/asistencias/${empleado.id_empleado}`}
        className="emoji-calendario"
        title="Ver asistencias"
      >
        📅
      </NavLink>

      <span className="empleado-nombre">
        {empleado.nombre} {empleado.apellido}
      </span>
      {usuario?.permisos.editar_datos_personales && usuario.rol == "2" && (
        <NavLink
          className={"link"}
          to={`/administrador/empleados/editarEmpleado`}
        >
          Editar
        </NavLink>
      )}

      <NavLink
        className={"link"}
        to={`/administrador/empleados/${empleado.id_empleado}/agregar-datos-laborales`}
      >
        Agregar datos laborales
      </NavLink>

      <NavLink
        className={"link"}
        to={`/administrador/empleados/${empleado.id_empleado}/agregar-jornada`}
      >
        Agregar jornada
      </NavLink>

      <NavLink
        className={"link"}
        to={`/administrador/empleados/${empleado.id_empleado}/inasistencia`}
      >
        Agregar inasistencia
      </NavLink>

      <NavLink
        className={"link"}
        to={`/administrador/empleados/${empleado.id_empleado}/asistenciaUnica`}
      >
        Agregar asistencia única
      </NavLink>
    </div>
  );
};

export default EmpleadoItem;

// import { useState } from 'react';
// import './estilos/empleado-item.css';
// import type { Empleado } from '../routes/Pantallas/Empleados';

// // Importá los componentes directamente
// import { EditarEmpleado } from '../routes/Pantallas/EditarEmpleado';
// import { EditarDatosLaborales } from '../routes/Pantallas/EditarDatosLaborales';
// import { Asistencias } from '../routes/Pantallas/Asistencias';

// export interface EmpleadoItemProps {
//   empleado: Empleado;
// }

// export const EmpleadoItem = ({ empleado }: EmpleadoItemProps) => {
//   const [mostrarEditar, setMostrarEditar] = useState(false);
//   const [mostrarDatosLaborales, setMostrarDatosLaborales] = useState(false);
//   const [mostrarAsistencias, setMostrarAsistencias] = useState(false);

//   const handleClick = (accion: 'editar' | 'laborales' | 'asistencias') => {
//     setMostrarEditar(false);
//     setMostrarDatosLaborales(false);
//     setMostrarAsistencias(false);

//     if (accion === 'editar') setMostrarEditar(true);
//     if (accion === 'laborales') setMostrarDatosLaborales(true);
//     if (accion === 'asistencias') setMostrarAsistencias(true);
//   };

//   return (
//     <div className="empleado-item">
//       <span className="icono-perfil">
//         <img
//           src="https://imgs.search.brave.com/z1pY-zOd_QZunrzoobVmAzPXl4KV3X43yVSRA6IYek4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lcy52/aXNhZm90by5jb20v/aW1nLzR4NC1jbS1w/YXNzcG9ydC1waG90/by1leGFtcGxlLndl/YnA"
//           alt=""
//           width="50px"
//         />
//       </span>
//       <span className="empleado-nombre">
//         {empleado.nombre} {empleado.apellido}
//       </span>

//       <button className="link" onClick={() => handleClick('editar')}>
//         Editar
//       </button>
//       <button className="link" onClick={() => handleClick('laborales')}>
//         Agregar datos laborales
//       </button>
//       <button className="link" onClick={() => handleClick('asistencias')}>
//         Agregar inasistencia
//       </button>

//       <div className="componente-renderizado">
//         {mostrarEditar && (
//   <>
//     {console.log('Empleado que se pasa:', empleado)}
//     <EditarEmpleado empleado={empleado} />
//   </>
// )}

//         {mostrarDatosLaborales && <EditarDatosLaborales />}
//         {mostrarAsistencias && <Asistencias />}
//       </div>
//     </div>
//   );
// };

// export default EmpleadoItem;
