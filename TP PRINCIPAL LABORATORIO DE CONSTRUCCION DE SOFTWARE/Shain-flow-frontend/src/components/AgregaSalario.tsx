import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarioInput from "./Calendario";
import "./estilos/FormularioSalario.css";

interface NuevoSalario {
  puesto: string;
  departamento: string;
  categoria: string;
  valor: string;
  fecha_inicio: string; // Formato "YYYY-MM-DD" o "" vacío
}

export interface Puesto {
  id_puesto: number;
  nombre: string;
}
export interface Departamento {
  id_departamento: number;
  nombre: string;
}
export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export function AgregarSalario() {
  const [errores, setErrores] = useState<{ [key in keyof NuevoSalario]?: boolean }>({});
  const [mensajeError] = useState<string>("");
  const navegar = useNavigate();

  const [nuevoSalario, setNuevoConcepto] = useState<NuevoSalario>({
    puesto: "",
    departamento: "",
    categoria: "",
    valor: "600000",
    fecha_inicio: "",
  });

  const [historialSalarios, setHistorialSalarios] = useState<any[]>([]);

  // Estados para opciones dinámicas
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    // Carga de puestos
    fetch("https://render-crud-jc22.onrender.com/api/puestos/")
      .then((res) => res.json())
      .then(setPuestos)
      .catch(console.error);

    // Carga de departamentos
    fetch("https://render-crud-jc22.onrender.com/api/departamentos/")
      .then((res) => res.json())
      .then(setDepartamentos)
      .catch(console.error);

    // Carga de categorías
    fetch("https://render-crud-jc22.onrender.com/api/categorias/")
      .then((res) => res.json())
      .then(setCategorias)
      .catch(console.error);
  }, []);

  // Funciones para obtener ID desde nombre seleccionado
const getPuestoId = (nombre: string) =>
  puestos.find((p) => p.nombre === nombre)?.id_puesto;

const getDepartamentoId = (nombre: string) =>
  departamentos.find((d) => d.nombre === nombre)?.id_departamento;

const getCategoriaId = (nombre: string) =>
  categorias.find((c) => c.nombre_categoria === nombre)?.id_categoria;

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const actualizado = { ...nuevoSalario, [name]: value };
    setNuevoConcepto(actualizado);
    setErrores((prev) => ({ ...prev, [name]: false }));

    const { puesto, departamento, categoria } = actualizado;
    if (puesto && departamento && categoria) {
      consultarHistorial(puesto, departamento, categoria);
    }
  };

  const manejarFecha = (fechaStr: string) => {
    const actualizado = { ...nuevoSalario, fecha_inicio: fechaStr };
    setNuevoConcepto(actualizado);

    const { puesto, departamento, categoria } = actualizado;
    if (puesto && departamento && categoria) {
      consultarHistorial(puesto, departamento, categoria);
    }
  };

  const consultarHistorial = async (
    puesto: string,
    departamento: string,
    categoria: string
  ) => {
    const puesto_id = getPuestoId(puesto);
    const departamento_id = getDepartamentoId(departamento);
    const categoria_id = getCategoriaId(categoria);


    if (!puesto_id || !departamento_id || !categoria_id) return;

    try {
      const response = await fetch(
        `https://render-crud-jc22.onrender.com/api/salarios/historial?puesto_id=${puesto_id}&departamento_id=${departamento_id}&categoria_id=${categoria_id}`
      );
      const data = await response.json();
      setHistorialSalarios(data);
    } catch (error) {
      console.error("Error al consultar historial:", error);
    }
  };

  const cargarSalario = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: { [key in keyof NuevoSalario]?: boolean } = {};
    (Object.entries(nuevoSalario) as [keyof NuevoSalario, string][]).forEach(
      ([key, valor]) => {
        if (key === "fecha_inicio") {
          if (!valor) nuevosErrores[key] = true;
        } else {
          if (!valor.trim()) nuevosErrores[key] = true;
        }
      }
    );
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const puesto_id = getPuestoId(nuevoSalario.puesto);
    const departamento_id = getDepartamentoId(nuevoSalario.departamento);
    const categoria_id = getCategoriaId(nuevoSalario.categoria);

    if (!puesto_id || !departamento_id || !categoria_id) {
      alert("Por favor, seleccione valores válidos para puesto, departamento y categoría.");
      return;
    }

    try {
      const response = await fetch(
        "https://render-crud-jc22.onrender.com/api/salarios/actualizarSalario",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            puesto_id,
            departamento_id,
            categoria_id,
            valor_por_defecto: parseFloat(nuevoSalario.valor),
            fecha_inicio: nuevoSalario.fecha_inicio || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error al guardar: " + (errorData.detail || response.statusText));
        return;
      }

      alert("Salario guardado correctamente!");
      navegar("/administrador/empleados-nomina");
    } catch (error) {
      console.error("Error en la petición PUT:", error);
      alert("Error de red o servidor. Intente nuevamente.");
    }
  };

  const volver = () => {
    navegar("/administrador/empleados-nomina");
  };

  const opcionesDepartamentos = departamentos.map((d) => d.nombre);
  const opcionesPuestos = puestos.map((p) => p.nombre);
  const opcionesCategoria = categorias.map((c) => c.nombre_categoria);

  return (
    <div className="agregar-salario">
      <h3>Gestion de salarios base</h3>
      <form className="agregar-salario-grid" onSubmit={cargarSalario}>
        {Object.entries(nuevoSalario).map(([campo, valor]) => {
          const label = campo
            .replace(/_/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase());

          let opciones: string[] = [];
          if (campo === "puesto") opciones = opcionesPuestos;
          else if (campo === "departamento") opciones = opcionesDepartamentos;
          else if (campo === "categoria") opciones = opcionesCategoria;

          return (
            <div key={campo} className="form-group">
              <label htmlFor={campo}>{label}</label>
              {opciones.length > 0 ? (
                <select
                  id={campo}
                  name={campo}
                  value={valor}
                  onChange={manejarCambio}
                  className={errores[campo as keyof NuevoSalario] ? "input-error" : ""}
                >
                  <option value="">Seleccione una opción</option>
                  {opciones.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              ) : campo === "fecha_inicio" ? (
                <CalendarioInput value={valor} onChange={manejarFecha} />
              ) : (
                <input
                  id={campo}
                  name={campo}
                  type="text"
                  value={valor}
                  onChange={manejarCambio}
                  className={errores[campo as keyof NuevoSalario] ? "input-error" : ""}
                />
              )}
            </div>
          );
        })}

        <div className="botones-agregar-salario">
          <button type="submit">✅ Cargar</button>
          <button type="button" onClick={volver}>
            ❌ Cancelar
          </button>
        </div>
      </form>

      {historialSalarios.length > 0 && (
        <div className="historial-salarios-tabla">
          <h4>Historial de salarios anteriores</h4>
          <table className="historial-salarios-tabla">
            <thead>
              <tr>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {historialSalarios.map((item, index) => (
                <tr key={index} className={item.fecha_fin === null ? "vigente" : ""}>
                  <td>{item.fecha_inicio}</td>
                  <td>{item.fecha_fin || "Actual"}</td>
                  <td>${item.valor.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
    </div>
  );
}