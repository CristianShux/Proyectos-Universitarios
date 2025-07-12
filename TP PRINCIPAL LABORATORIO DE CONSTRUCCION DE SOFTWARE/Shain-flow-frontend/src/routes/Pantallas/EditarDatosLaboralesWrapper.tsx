import { useParams } from "react-router-dom";
import { EditarDatosLaborales } from "./EditarDatosLaborales";

export const EditarDatosLaboralesWrapper = () => {
  const { id_empleado } = useParams();

  // Validación simple: si el param no existe o no es número, usar 0 (o redirigir)
  const idEmpleado = parseInt(id_empleado || "0", 10);

  return <EditarDatosLaborales idEmpleado={idEmpleado} />;
};