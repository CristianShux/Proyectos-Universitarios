import { useEffect, useState } from "react";
import { registroAsistenciasPorId } from "../../services/api";
import "../../estilos/asistencias.css";
import { CircularProgress } from "@mui/material";
import { useUser } from "../../context/UserContext";

// const mes = new Date().getMonth() + 1;
// const anio = new Date().getFullYear();

interface RegistroAsistencia {
  fecha: string; // formato: "YYYY-MM-DD"
  dia: string;
  horaEntrada: string; // formato: "HH:mm"
  horaSalida: string;  // formato: "HH:mm"
  estado: string;
  horasExtras: string;
}

const calcularHorasTrabajadas = (entrada: string, salida: string) => {
  if (!entrada || !salida || entrada === "---" || salida === "---") return "---";
  const [h1, m1] = entrada.split(":").map(Number);
  const [h2, m2] = salida.split(":").map(Number);
  if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return "";
  const inicio = h1 * 60 + m1;
  const fin = h2 * 60 + m2;
  const diferencia = fin - inicio;
  if (diferencia <= 0) return "";
  const horas = Math.floor(diferencia / 60);
  const minutos = diferencia % 60;
  return minutos === 0 ? `${horas} h` : `${horas} h ${minutos} min`;
};

// const obtenerNombreDia = (dia: number | string) => {
//   if (typeof dia === 'string') dia = parseInt(dia);
//   if (!Number.isInteger(dia) || dia <= 0 || dia > 31) return "---";
//   const fecha = new Date(anio, mes - 1, dia);
//   if (isNaN(fecha.getTime())) return "---";
//   return new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(fecha);
// };


export const Asistencias = () => {
  const [cargando, setCargando] = useState(false);
  const { usuario } = useUser();
  const [asistenciasPorMes, setAsistenciasPorMes] = useState<Record<string, RegistroAsistencia[]>>({});
const [mesSeleccionado, setMesSeleccionado] = useState<string>("");


  useEffect(() => {
  const fetchAsistencias = async () => {
    try {
      setCargando(true);
    console.log(usuario);
    console.log(`ID del empleado: ${usuario?.id_empleado}`);
    
      const datosCrudos = await registroAsistenciasPorId(JSON.stringify(usuario?.id_empleado));

      console.log("Datos crudos de asistencias:", datosCrudos);

      const asistenciasAdaptadas: RegistroAsistencia[] = datosCrudos.map((registro: any[]) => {
        const [fecha, dia, horaEntrada, horaSalida, ,horasExtras,estado] = registro;
        return {
          fecha: fecha || "---",
          dia: dia || "---",
          horaEntrada: horaEntrada || "---",
          horaSalida: horaSalida || "---",
          horasExtras: horasExtras?.toString() || "0",
          estado: estado || "Sin estado"
        };
      });

      // Agrupar por mes
      const agrupadas: Record<string, RegistroAsistencia[]> = {};
      asistenciasAdaptadas.forEach((asis) => {
        const mes = asis.fecha?.substring(0, 7); // "YYYY-MM"        
        if (!agrupadas[mes]) agrupadas[mes] = [];
        agrupadas[mes].push(asis);
      });

      setAsistenciasPorMes(agrupadas);

      // Establecer el mes actual por defecto
      const mesActual = new Date().toISOString().substring(0, 7);
      setMesSeleccionado(agrupadas[mesActual] ? mesActual : Object.keys(agrupadas)[0]);
      
    } catch (error) {
      console.error("Error al obtener las asistencias:", error);
    } finally {
      setCargando(false);
    }
  };

  fetchAsistencias();
}, []);

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

  return (
  <div className="layout">
    <div className="cont-asistencias">
      <h2>Registro de asistencias del mes</h2>
      <h3>
        En esta sección podrás consultar tu historial de asistencias correspondiente al mes actual.
        Cada fila representa un día del mes, indicando tu hora de entrada, salida, estado de asistencia y si se registraron horas extras.
      </h3>

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
        {new Date((mes) + "-02").toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
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
              <th className="col-fecha">Fecha</th>
              <th className="col-dia">Día</th>
              <th className="col-he">HE</th>
              <th className="col-hs">HS</th>
              <th className="col-ht">HT</th>
              <th className="col-hex">HEX</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
  {(asistenciasPorMes[mesSeleccionado] || []).map((asistencia, index) => {
    const { fecha, dia, horaEntrada, horaSalida, estado, horasExtras } = asistencia;
    const horasTrabajadas = calcularHorasTrabajadas(horaEntrada, horaSalida);
    return (
      <tr key={index}>
  <td data-label="Fecha">{fecha}</td>
  <td data-label="Día">{dia}</td>
  <td data-label="HE">{horaEntrada}</td>
  <td data-label="HS">{horaSalida}</td>
  <td data-label="HT">{horasTrabajadas}</td>
  <td data-label="HEX">{horasExtras}</td>
  <td data-label="Estado" className={clasesEstado[estado] || ""}>{estado}</td>
</tr>
    );
  })}
</tbody>
        </table>
      </div>
    </div>
  </div>
);
};
