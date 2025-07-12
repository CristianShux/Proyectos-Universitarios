import React, { useEffect, useState } from "react";
import "./estilos/Concepto.css";

interface Departamento {
  id_departamento: number;
  nombre: string;
  descripcion: string;
}

export const AgregaDepartamento: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: "", descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://render-crud-jc22.onrender.com/api/departamentos/");
      if (!res.ok) throw new Error("Error al cargar departamentos");
      const data = await res.json();
      const lista = data.map((dep: any) => ({
        id_departamento: dep.id_departamento,
        nombre: dep.nombre,
        descripcion: dep.descripcion,
      }));
      setDepartamentos(lista);
    } catch (error) {
      alert("No se pudieron cargar los departamentos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const agregarDepartamento = async () => {
    if (!nuevo.nombre.trim() || !nuevo.descripcion.trim()) {
      alert("Nombre y descripción son obligatorios");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("https://render-crud-jc22.onrender.com/api/departamentos/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevo.nombre.trim(),
          descripcion: nuevo.descripcion.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          alert("Ya existe un departamento con ese nombre.");
        } else if (res.status === 400) {
          alert("Datos inválidos: " + (err.detail || "Verifique los campos."));
        } else {
          alert("Error al crear departamento: " + (err.detail || res.statusText));
        }
        return;
      }

      await cargarDepartamentos();
      setNuevo({ nombre: "", descripcion: "" });
      alert("Departamento agregado");
    } catch (error) {
      alert("Error de red al crear departamento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarDepartamento = async (id_departamento: number, nombre: string) => {
    if (!window.confirm(`¿Querés eliminar el departamento "${nombre}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://render-crud-jc22.onrender.com/api/departamentos/${id_departamento}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        alert("Error al eliminar: " + (err.detail || res.statusText));
        return;
      }
      await cargarDepartamentos();
      alert("Departamento eliminado");
    } catch (error) {
      alert("Error de red al eliminar");
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
      <h3>Gestión de Departamentos</h3>

      {loading && <p>Cargando...</p>}

      {/* Input filtro por nombre */}
      <input
        type="text"
        placeholder="Filtrar por nombre..."
        value={filtroNombre}
        onChange={(e) => setFiltroNombre(e.target.value)}
        className="input-filtro"
        
      />

      <div className="concepto-tabla-contenedor">
        <table className="tabla-concepto">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila de nuevo */}
            <tr>
              <td>
                <input
                  name="nombre"
                  value={nuevo.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                />
              </td>
              <td>
                <input
                  name="descripcion"
                  value={nuevo.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción"
                />
              </td>
              <td>
                <button
                  className="agregar"
                  onClick={agregarDepartamento}
                  disabled={loading}
                >
                  Agregar
                </button>
              </td>
            </tr>

            {/* Filas existentes filtradas */}
            {departamentos
              .filter((dep) =>
                dep.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
              )
              .map((dep, index) => (
                <tr key={dep.id_departamento || index}>
                  <td>{dep.nombre}</td>
                  <td>{dep.descripcion}</td>
                  <td>
                    <button
                      className="eliminar"
                      onClick={() =>
                        eliminarDepartamento(dep.id_departamento, dep.nombre)
                      }
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