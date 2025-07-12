import React, { useEffect, useState } from "react";
import "./estilos/Concepto.css";

interface Configuracion {
  clave: string;
  valor: string; // Por ejemplo: "00:05:00" o "1 hour"
  descripcion: string;
}

export const ConfiguracionAsistencia: React.FC = () => {
  const [configuraciones, setConfiguraciones] = useState<Configuracion[]>([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState<{ [clave: string]: string }>({});

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://render-crud-jc22.onrender.com/api/configuracion-asistencia/");
      if (!res.ok) throw new Error("Error al obtener configuraciones");
      const data = await res.json();
      setConfiguraciones(data);
      const editInit: { [clave: string]: string } = {};
      data.forEach((c: Configuracion) => (editInit[c.clave] = c.valor));
      setEditando(editInit);
    } catch (error) {
      alert("No se pudieron cargar las configuraciones.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const traducirIntervalo = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/\bminutos?\b/g, "minutes")
      .replace(/\bhoras?\b/g, "hours")
      .replace(/\bd[ií]as?\b/g, "days")
      .replace(/\bsegundos?\b/g, "seconds")
      .replace(/\by\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const actualizarConfiguracion = async (clave: string) => {
    let nuevoValor = editando[clave];
    nuevoValor = traducirIntervalo(nuevoValor);

    try {
      setLoading(true);
      const res = await fetch(`https://render-crud-jc22.onrender.com/api/configuracion-asistencia/${clave}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: nuevoValor }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error al actualizar: " + (err.detail || res.statusText));
        return;
      }

      alert("Configuración actualizada correctamente");
      await cargarConfiguraciones();
    } catch (error) {
      alert("Error de red al actualizar");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (clave: string, valor: string) => {
    setEditando((prev) => ({ ...prev, [clave]: valor }));
  };

  return (
    <div className="formulario-concepto">
      <h3>Configuración de Tiempos de Asistencia</h3>

      {loading && <p>Cargando...</p>}

      <div className="concepto-tabla-contenedor">
        <table className="tabla-concepto">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Tiempo (intervalo)</th>
              <th>Descripción</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {configuraciones.map((conf) => (
              <tr key={conf.clave}>
                <td>{conf.clave}</td>
                <td>
                  <input
                    value={editando[conf.clave] || ""}
                    onChange={(e) => handleInputChange(conf.clave, e.target.value)}
                    placeholder="Ej: 00:05:00 o 5 minutos / 5 minutes"
                  />
                  <br />
                  <small style={{ color: "#666", fontSize: "0.85em" }}>
                    Podés ingresar el tiempo en formato <b>HH:MM:SS</b> (ej. 00:05:00), en español (ej. 5 minutos) o en inglés (ej. 5 minutes)
                  </small>
                </td>
                <td>{conf.descripcion}</td>
                <td>
                  <button
                    className="agregar"
                    onClick={() => actualizarConfiguracion(conf.clave)}
                    disabled={loading}
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};