import { NavLink } from 'react-router-dom';
import './estilos/empleado-item.css';
import type { Empleado } from '../routes/Pantallas/Empleados';

// interface Empleado {
//   id: number;
//   nombre: string;
// }

interface EmpleadoNominaProps {
  empleado: Empleado;
}

export const EmpleadoNomina = ({ empleado }: EmpleadoNominaProps) => {
  return (
    <div className="empleado-item">
      <span className="icono-perfil">👤</span>
      <span className='empleado-nombre'>{empleado.nombre} {empleado.apellido}</span>
      <NavLink className={"link"} to="/administrador/calculo-nomina" >Calcular manualmente</NavLink>
      <NavLink className={"link"} to="/administrador/calcular-nomina" >Calcular automáticamente</NavLink>
    </div>
  );
};

export default EmpleadoNomina;
