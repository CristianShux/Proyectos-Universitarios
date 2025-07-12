import React, { useEffect, useState } from "react";
import "./estilos/Concepto.css";

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export const AgregaCategoria: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevo, setNuevo] = useState({ nombre_categoria: "" });
  const [loading, setLoading] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://render-crud-jc22.onrender.com/api/categorias/");
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      alert("No se pudieron cargar las categorías.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const agregarCategoria = async () => {
    if (!nuevo.nombre_categoria.trim()) {
      alert("El nombre de la categoría es obligatorio");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("https://render-crud-jc22.onrender.com/api/categorias/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_categoria: nuevo.nombre_categoria.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          alert("Ya existe una categoría con ese nombre.");
        } else if (res.status === 400) {
          alert("Datos inválidos: " + (err.detail || "Verifique los campos."));
        } else {
          alert("Error al crear categoría: " + (err.detail || res.statusText));
        }
        return;
      }

      await cargarCategorias();
      setNuevo({ nombre_categoria: "" });
      alert("Categoría agregada");
    } catch (error) {
      alert("Error de red al agregar categoría");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarCategoria = async (id_categoria: number, nombre_categoria: string) => {
    if (!window.confirm(`¿Querés eliminar la categoría "${nombre_categoria}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://render-crud-jc22.onrender.com/api/categorias/${id_categoria}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        alert("Error al eliminar: " + (err.detail || res.statusText));
        return;
      }
      await cargarCategorias();
      alert("Categoría eliminada");
    } catch (error) {
      alert("Error de red al eliminar categoría");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevo({ nombre_categoria: e.target.value });
  };

  return (
    <div className="formulario-concepto">
      <h3>Gestión de Categorías</h3>

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
            {/* Fila para nueva categoría */}
            <tr>
              <td>
                <input
                  name="nombre_categoria"
                  value={nuevo.nombre_categoria}
                  onChange={handleInputChange}
                  placeholder="Nombre de la Categoría"
                />
              </td>
              <td>
                <button
                  className="agregar"
                  onClick={agregarCategoria}
                  disabled={loading}
                >
                  Agregar
                </button>
              </td>
            </tr>

            {/* Categorías existentes filtradas */}
            {categorias
              .filter((c) =>
                c.nombre_categoria.toLowerCase().includes(filtroNombre.toLowerCase())
              )
              .map((c) => (
                <tr key={c.id_categoria}>
                  <td>{c.nombre_categoria}</td>
                  <td>
                    <button
                      className="eliminar"
                      onClick={() => eliminarCategoria(c.id_categoria, c.nombre_categoria)}
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