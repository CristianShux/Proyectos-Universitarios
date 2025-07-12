import React, { useEffect, useState } from "react";
import "./estilos/Concepto.css";

type Concepto = {
  codigo?: string; // Lo maneja el backend
  nombre: string;
  tipo: string;
  valor: string;
  porcentaje: string;
};

const tiposConcepto = [
  "Remunerativo",
  "No remunerativo",
  "Deducción",
  "Retención",
  "Percepción",
  "Indemnización",
  "Reintegro",
  "Premio",
  "Multa",
  "Ajuste",
  "Anticipo",
  "Vacaciones",
];

const codigosNoEliminables = [
  "C001",
  "C002",
  "C003",
  "C004",
  "C005",
  "C006",
  "C007",
];

const porcentajeOptions = ["si", "no"];
export const NuevoConcepto: React.FC = () => {
  const [conceptos, setConceptos] = useState<Concepto[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [nuevo, setNuevo] = useState<Concepto>({
    nombre: "",
    tipo: "",
    valor: "",
    porcentaje: "",
  });
  const [loading, setLoading] = useState(false);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  // Cargar conceptos del backend al montar
  useEffect(() => {
    cargarConceptos();
  }, []);

  const cargarConceptos = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://render-crud-jc22.onrender.com/api/conceptos/"
      );
      if (!res.ok) throw new Error("Error al cargar conceptos");
      const data = await res.json();
      // Ajustamos el formato recibido para el frontend
      const lista = data.map((c: any) => ({
        codigo: c.codigo,
        nombre: c.descripcion,
        tipo: c.tipo_concepto,
        valor: c.valor_por_defecto ? String(c.valor_por_defecto) : "",
        porcentaje: c.es_porcentaje ? "si" : "no",
      }));
      setConceptos(lista);
    } catch (error) {
      alert("No se pudieron cargar los conceptos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const conceptosFiltrados = conceptos.filter((c) => {
    const coincideNombre = c.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideTipo = filtroTipo === "" || c.tipo === filtroTipo;
    return coincideNombre && coincideTipo;
  });

  // Crear concepto nuevo en backend
  const agregarConcepto = async () => {
    if (!nuevo.nombre.trim() || !nuevo.valor.trim()) {
      alert("Nombre y valor son obligatorios");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://render-crud-jc22.onrender.com/api/conceptos/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            descripcion: nuevo.nombre,
            tipo_concepto: nuevo.tipo,
            valor_por_defecto: parseFloat(nuevo.valor),
            es_porcentaje: nuevo.porcentaje === "si",
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          alert("Ya existe un concepto con ese nombre.");
        } else if (res.status === 400) {
          alert("Datos inválidos: " + (err.detail || "Verifique los campos."));
        } else {
          alert("Error al crear concepto: " + (err.detail || res.statusText));
        }
        return;
      }

      await cargarConceptos();
      setNuevo({ nombre: "", tipo: "", valor: "", porcentaje: "" });
      alert("Concepto agregado con éxito");
    } catch (error) {
      alert("Error de red al crear concepto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar edición en backend
  const guardarEdicion = async (index: number) => {
    const conceptoEditado = conceptos[index];
    if (!conceptoEditado.nombre.trim() || !conceptoEditado.valor.trim()) {
      alert("Nombre y valor son obligatorios");
      return;
    }
    if (!conceptoEditado.codigo) {
      alert("Error: el concepto no tiene código");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://render-crud-jc22.onrender.com/api/conceptos/${conceptoEditado.codigo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            descripcion: conceptoEditado.nombre,
            tipo_concepto: conceptoEditado.tipo,
            valor_por_defecto: parseFloat(conceptoEditado.valor),
            es_porcentaje: conceptoEditado.porcentaje === "si",
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        alert("Error al editar concepto: " + (err.detail || res.statusText));
        return;
      }
      await cargarConceptos();
      setEditIndex(null);
      alert("Concepto actualizado");
    } catch (error) {
      alert("Error de red al editar concepto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar concepto en backend
  const eliminarConcepto = async (index: number) => {
    const conceptoEliminar = conceptos[index];
    if (!conceptoEliminar.codigo) {
      alert("Error: el concepto no tiene código");
      return;
    }
    if (
      !window.confirm(
        `¿Querés eliminar el concepto "${conceptoEliminar.nombre}"?`
      )
    )
      return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://render-crud-jc22.onrender.com/api/conceptos/${conceptoEliminar.codigo}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const err = await res.json();
        alert("Error al eliminar concepto: " + (err.detail || res.statusText));
        return;
      }
      await cargarConceptos();
      alert("Concepto eliminado");
    } catch (error) {
      alert("Error de red al eliminar concepto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Manejador cambios inputs en tabla y en nuevo concepto
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const copia = [...conceptos];
      copia[index] = { ...copia[index], [name]: value };
      setConceptos(copia);
    } else {
      setNuevo({ ...nuevo, [name]: value });
    }
  };

  return (
    <div className="formulario-concepto">
      <h3>Gestión de Conceptos</h3>

      {loading && <p>Cargando...</p>}
      <div className="filtros-conceptos">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {tiposConcepto.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
      <div className="concepto-tabla-contenedor">
        <table className="tabla-concepto">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>%</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Fila para nuevo concepto (arriba) */}
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
                <select
                  name="tipo"
                  value={nuevo.tipo}
                  onChange={handleInputChange}
                >
                  <option value="">--</option>
                  {tiposConcepto.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  name="valor"
                  value={nuevo.valor}
                  onChange={handleInputChange}
                  placeholder="Valor"
                />
              </td>
              <td>
                <select
                  name="porcentaje"
                  value={nuevo.porcentaje}
                  onChange={handleInputChange}
                >
                  <option value="">--</option>
                  {porcentajeOptions.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="agregar"
                  onClick={agregarConcepto}
                  disabled={loading}
                >
                  Agregar
                </button>
              </td>
            </tr>

            {/* Fila para edición o vista */}
            {conceptosFiltrados.map((concepto, index) => (
              <tr key={concepto.codigo || index}>
                {editIndex === index ? (
                  <>
                    <td>
                      <input
                        name="nombre"
                        value={concepto.nombre}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </td>
                    <td>
                      <select
                        name="tipo"
                        value={concepto.tipo}
                        onChange={(e) => handleInputChange(e, index)}
                      >
                        <option value="">--</option>
                        {tiposConcepto.map((tipo) => (
                          <option key={tipo} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        name="valor"
                        value={concepto.valor}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </td>
                    <td>
                      <select
                        name="porcentaje"
                        value={concepto.porcentaje}
                        onChange={(e) => handleInputChange(e, index)}
                      >
                        <option value="">--</option>
                        {porcentajeOptions.map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="guardar"
                        onClick={() => guardarEdicion(index)}
                      >
                        Guardar
                      </button>
                      <button
                        className="cancelar"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{concepto.nombre}</td>
                    <td>{concepto.tipo}</td>
                    <td>{concepto.valor}</td>
                    <td>{concepto.porcentaje}</td>
                    <td>
                      <button
                        className="editar"
                        onClick={() => setEditIndex(index)}
                      >
                        Editar
                      </button>
                      {codigosNoEliminables.includes(concepto.codigo || "") ? (
                        <button
                          className="eliminar"
                          disabled
                          title="Este concepto no puede eliminarse"
                        >
                          Eliminar
                        </button>
                      ) : (
                        <button
                          className="eliminar"
                          onClick={() => eliminarConcepto(index)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
