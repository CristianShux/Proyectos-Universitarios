import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { registroAsistenciasPorId } from "../../services/api";
import "../../estilos/asistencias.css";
import { CircularProgress } from "@mui/material";

interface RegistroAsistencia {
  fecha: string;
  dia: string;
  horaEntrada: string;
  horaSalida: string;
  estado: string;
  horasExtras: string;
}

const calcularHorasTrabajadas = (entrada: string, salida: string) => {
  if (!entrada || !salida || entrada === "---" || salida === "---") return "---";
  const [h1, m1] = entrada.split(":").map(Number);
  const [h2, m2] = salida.split(":").map(Number);
  const inicio = h1 * 60 + m1;
  const fin = h2 * 60 + m2;
  const diff = fin - inicio;
  if (diff <= 0) return "";
  const horas = Math.floor(diff / 60);
  const minutos = diff % 60;
  return minutos === 0 ? `${horas} h` : `${horas} h ${minutos} min`;
};

export const AsistenciasEmpleado = () => {
  const { idEmpleado } = useParams<{ idEmpleado: string }>();
  const [cargando, setCargando] = useState(false);
  const [asistenciasPorMes, setAsistenciasPorMes] = useState<Record<string, RegistroAsistencia[]>>({});
  const [mesSeleccionado, setMesSeleccionado] = useState<string>("");

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        setCargando(true);
        const datosCrudos = await registroAsistenciasPorId(idEmpleado!);

        const asistencias: RegistroAsistencia[] = datosCrudos.map((registro: any[]) => {
          const [fecha, dia, horaEntrada, horaSalida, , horasExtras, estado] = registro;
          return {
            fecha: fecha || "---",
            dia: dia || "---",
            horaEntrada: horaEntrada || "---",
            horaSalida: horaSalida || "---",
            horasExtras: horasExtras?.toString() || "0",
            estado: estado || "Sin estado"
          };
        });

        const agrupadas: Record<string, RegistroAsistencia[]> = {};
        asistencias.forEach((asis) => {
          const mes = asis.fecha.substring(0, 7);
          if (!agrupadas[mes]) agrupadas[mes] = [];
          agrupadas[mes].push(asis);
        });

        setAsistenciasPorMes(agrupadas);
        const mesActual = new Date().toISOString().substring(0, 7);
        setMesSeleccionado(agrupadas[mesActual] ? mesActual : Object.keys(agrupadas)[0]);
      } catch (error) {
        console.error("Error al obtener asistencias:", error);
      } finally {
        setCargando(false);
      }
    };

    if (idEmpleado) {
      fetchAsistencias();
    }
  }, [idEmpleado]);

  const clasesEstado: Record<string, string> = {
    'Completa': 'completa',
    'Incompleta': 'incompleta',
    'Falta': 'falta',
    'Licencia médica': 'licencia-medica',
    'Vacaciones': 'vacaciones',
    'Suspensión': 'suspension',
    'No laboral': 'no-laboral',
    'Completa con horas extra': 'comp-he',
    'Otra': 'otra'
  };

  if (!idEmpleado) {
    return <p>No se encontró el ID del empleado en la URL.</p>;
  }

  return (
    <div className="layout">
      <div className="cont-asistencias">
        <h2>Registro de asistencias</h2>
        <h3>Consulta el historial de asistencias del empleado seleccionado.</h3>

        <ul className="leyenda-abreviaciones">
          <li><strong>HE</strong> → Hora de entrada</li>
          <li><strong>HS</strong> → Hora de salida</li>
          <li><strong>HT</strong> → Horas trabajadas</li>
          <li><strong>HEX</strong> → Horas Extras</li>
        </ul>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="mes">Seleccionar mes: </label>
          <select
            id="mes"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
          >
            {Object.keys(asistenciasPorMes).map((mes) => (
              <option key={mes} value={mes}>
                {new Date(mes + "-02").toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long"
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="asistencias" style={{ position: 'relative' }}>
          {cargando && (
            <div className="overlay">
              <CircularProgress />
            </div>
          )}

          <table style={{ filter: cargando ? 'blur(2px)' : 'none' }}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Día</th>
                <th>HE</th>
                <th>HS</th>
                <th>HT</th>
                <th>HEX</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {(asistenciasPorMes[mesSeleccionado] || []).map((asistencia, index) => (
                <tr key={index}>
                  <td>{asistencia.fecha}</td>
                  <td>{asistencia.dia}</td>
                  <td>{asistencia.horaEntrada}</td>
                  <td>{asistencia.horaSalida}</td>
                  <td>{calcularHorasTrabajadas(asistencia.horaEntrada, asistencia.horaSalida)}</td>
                  <td>{asistencia.horasExtras}</td>
                  <td className={clasesEstado[asistencia.estado] || ""}>{asistencia.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};