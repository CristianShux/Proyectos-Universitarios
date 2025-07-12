import React, { useEffect, useState } from "react";
import "./estilos/Concepto.css";

interface Puesto {
  id_puesto: number;
  nombre: string;
}

export const AgregaPuesto: React.FC = () => {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: "" });
  const [loading, setLoading] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");

  useEffect(() => {
    cargarPuestos();
  }, []);

  const cargarPuestos = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://render-crud-jc22.onrender.com/api/puestos/");
      if (!res.ok) throw new Error("Error al cargar puestos");
      const data = await res.json();
      const lista = data.map((p: any) => ({
        id_puesto: p.id_puesto,
        nombre: p.nombre,
      }));
      setPuestos(lista);
    } catch (error) {
      alert("No se pudieron cargar los puestos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const agregarPuesto = async () => {
    if (!nuevo.nombre.trim()) {
      alert("El nombre del puesto es obligatorio");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("https://render-crud-jc22.onrender.com/api/puestos/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevo.nombre.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          alert("Ya existe un puesto con ese nombre.");
        } else if (res.status === 400) {
          alert("Datos inválidos: " + (err.detail || "Verifique los campos."));
        } else {
          alert("Error al crear puesto: " + (err.detail || res.statusText));
        }
        return;
      }

      await cargarPuestos();
      setNuevo({ nombre: "" });
      alert("Puesto agregado");
    } catch (error) {
      alert("Error de red al agregar puesto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPuesto = async (id_puesto: number, nombre: string) => {
    if (!window.confirm(`¿Querés eliminar el puesto "${nombre}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://render-crud-jc22.onrender.com/api/puestos/${id_puesto}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        alert("Error al eliminar: " + (err.detail || res.statusText));
        return;
      }
      await cargarPuestos();
      alert("Puesto eliminado");
    } catch (error) {
      alert("Error de red al eliminar puesto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="formulario-concepto">
      <h3>Gestión de Puestos</h3>

      {loading && <p>Cargando...</p>}

      {/* Input filtro por nombre */}
      <input
        type="text"
        placeholder="Filtrar por nombre..."
        value={filtroNombre}
        onChange={(e) => setFiltroNombre(e.target.value)}
        className="input-filtro"
        style={{ marginBottom: "10px", padding: "6px 10px", maxWidth: "300px", borderRadius: "6px", border: "1px solid #ccc" }}
      />

      <div className="concepto-tabla-contenedor">
        <table className="tabla-concepto">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila para nuevo puesto */}
            <tr>
              <td>
                <input
                  name="nombre"
                  value={nuevo.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre del Puesto"
                />
              </td>
              <td>
                <button
                  className="agregar"
                  onClick={agregarPuesto}
                  disabled={loading}
                >
                  Agregar
                </button>
              </td>
            </tr>

            {/* Puestos existentes filtrados */}
            {puestos
              .filter((p) =>
                p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
              )
              .map((p, index) => (
                <tr key={p.id_puesto || index}>
                  <td>{p.nombre}</td>
                  <td>
                    <button
                      className="eliminar"
                      onClick={() => eliminarPuesto(p.id_puesto, p.nombre)}
                      disabled={loading}
                    >
                      Eliminar
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