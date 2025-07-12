import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarioInput from "../../components/Calendario";
import HoraInput from "../../components/Hora";
import "../../estilos/EditarEmpelado.css";

export interface PersonalDataType {
  departamento: string;
  puesto: string;
  categoria: string;
  fechaAlta: string;
  horaIngreso: string;
  horaSalida: string;
  cantidadHoras: string;
  tipoContrato: string;
  estado: string;
  tipoSemana: string;
  turno: string;
}

interface Departamento {
  id_departamento: number;
  nombre: string;
}

interface Puesto {
  id_puesto: number;
  nombre: string;
}

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

interface EditarDatosLaboralesProps {
  idEmpleado: number;
}

export const EditarDatosLaborales: React.FC<EditarDatosLaboralesProps> = ({
  idEmpleado,
}) => {
  const navegar = useNavigate();
  const [isEditable, setIsEditable] = useState(false);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [personalData, setPersonalData] = useState<PersonalDataType>({
    departamento: "",
    puesto: "",
    categoria: "",
    fechaAlta: "",
    horaIngreso: "",
    horaSalida: "",
    cantidadHoras: "",
    tipoContrato: "",
    estado: "",
    tipoSemana: "",
    turno: "",
  });

  const cargarOpciones = async () => {
    try {
      const [depRes, pueRes, catRes] = await Promise.all([
        fetch("https://render-crud-jc22.onrender.com/api/departamentos/"),
        fetch("https://render-crud-jc22.onrender.com/api/puestos/"),
        fetch("https://render-crud-jc22.onrender.com/api/categorias/"),
      ]);
      const [depData, pueData, catData] = await Promise.all([
        depRes.json(),
        pueRes.json(),
        catRes.json(),
      ]);
      setDepartamentos(depData);
      setPuestos(pueData);
      setCategorias(catData);
    } catch (err) {
      console.error("Error al cargar opciones", err);
    }
  };

  const opcionesTipoContrato = [
    "Tiempo indeterminado",
    "Tiempo parcial",
    "A plazo fijo",
    "Por temporada",
    "Eventual",
    "Pasantia",
  ];

  const opcionesEstado = [
    "Activo",
    "Suspendido",
    "Desafectado",
    "Licencia",
    "En formación",
    "Jubilado",
    "Vacaciones",
  ];

  const opcionesSemanaLaboral = ["Normal", "Extendida", "Completa"];
  const opcionesTurno = ["Mañana", "Tarde", "Noche"];

  useEffect(() => {
  const cargarDatos = async () => {
    try {
      // Cargar opciones
      const [depRes, pueRes, catRes] = await Promise.all([
        fetch("https://render-crud-jc22.onrender.com/api/departamentos/"),
        fetch("https://render-crud-jc22.onrender.com/api/puestos/"),
        fetch("https://render-crud-jc22.onrender.com/api/categorias/")
      ]);

      const [depData, pueData, catData] = await Promise.all([
        depRes.json(),
        pueRes.json(),
        catRes.json()
      ]);

      setDepartamentos(depData);
      setPuestos(pueData);
      setCategorias(catData);

      // Datos laborales del empleado (con IDs)
      const res = await fetch(
        `https://render-crud-jc22.onrender.com/empleados/${idEmpleado}/informacion-laboral-completa`
      );
      const data = await res.json();

      // Mapear IDs a nombres
      const departamentoObj = depData.find(
        (d: Departamento) => d.id_departamento === data.id_departamento
      );
      const puestoObj = pueData.find(
        (p: Puesto) => p.id_puesto === data.id_puesto
      );
      const categoriaObj = catData.find(
        (c: Categoria) => c.id_categoria === data.id_categoria
      );

      setPersonalData({
        departamento: departamentoObj ? departamentoObj.nombre : "",
        puesto: puestoObj ? puestoObj.nombre : "",
        categoria: categoriaObj ? categoriaObj.nombre_categoria : "",
        fechaAlta: data.fecha_ingreso,
        horaIngreso: data.hora_inicio_turno,
        horaSalida: data.hora_fin_turno,
        cantidadHoras: data.cantidad_horas_trabajo?.toString() || "",
        tipoContrato: data.tipo_contrato,
        estado: data.estado,
        tipoSemana: data.tipo_semana_laboral,
        turno: data.turno,
      });
    } catch (err) {
      console.error("Error al cargar datos laborales y opciones", err);
    }
  };

  if (!isNaN(idEmpleado)) {
    cargarDatos();
  }
}, [idEmpleado]);

  const handleChange = (e: { target: { name?: string; value: string } }) => {
    const { name, value } = e.target;
    if (!name) return;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const departamentoSeleccionado = departamentos.find(
        (d) => d.nombre === personalData.departamento
      );
      const puestoSeleccionado = puestos.find(
        (p) => p.nombre === personalData.puesto
      );
      const categoriaSeleccionada = categorias.find(
        (c) => c.nombre_categoria === personalData.categoria
      );

      if (
        !departamentoSeleccionado ||
        !puestoSeleccionado ||
        !categoriaSeleccionada
      ) {
        alert("Seleccione valores válidos.");
        return;
      }

      const payload = {
        id_empleado: idEmpleado,
        id_departamento: departamentoSeleccionado.id_departamento,
        id_puesto: puestoSeleccionado.id_puesto,
        id_categoria: categoriaSeleccionada.id_categoria,
        fecha_ingreso: personalData.fechaAlta,
        turno: personalData.turno,
        hora_inicio_turno: personalData.horaIngreso,
        hora_fin_turno: personalData.horaSalida,
        cantidad_horas_trabajo: parseInt(personalData.cantidadHoras),
        tipo_contrato: personalData.tipoContrato,
        estado: personalData.estado,
        tipo_semana_laboral: personalData.tipoSemana,
      };
console.log("Payload que se envía:", payload);
      const res = await fetch(
        "https://render-crud-jc22.onrender.com/api/informacion-laboral/modificar",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.detail || "No se pudo actualizar"));
        return;
      }

      alert("Información laboral actualizada correctamente");
      setIsEditable(false);
    } catch (error) {
      console.error("Error al guardar cambios", error);
    }
  };

  return (
    <div className="editar-datos-laborales-container">
      <div className="editar-datos-laborales-card">
        <h2 className="editar-datos-laborales-title">Información Laboral</h2>

        <div className="editar-datos-laborales-data-container">
          <div className="editar-datos-laborales-group">
            {/* Departamento */}
            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Departamento:</p>
              {isEditable ? (
                <select
                  name="departamento"
                  value={personalData.departamento}
                  onChange={handleChange}
                  className="editar-datos-laborales-input editable"
                >
                  <option value="">Seleccione una opción</option>
                  {departamentos.map((dep) => (
                    <option key={dep.id_departamento} value={dep.nombre}>
                      {dep.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={personalData.departamento}
                  readOnly
                  className="editar-datos-laborales-input"
                />
              )}
            </div>

            {/* Puesto */}
            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Puesto:</p>
              {isEditable ? (
                <select
                  name="puesto"
                  value={personalData.puesto}
                  onChange={handleChange}
                  className="editar-datos-laborales-input editable"
                >
                  <option value="">Seleccione una opción</option>
                  {puestos.map((pue) => (
                    <option key={pue.id_puesto} value={pue.nombre}>
                      {pue.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={personalData.puesto}
                  readOnly
                  className="editar-datos-laborales-input"
                />
              )}
            </div>

            {/* Categoría */}
            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Categoría:</p>
              {isEditable ? (
                <select
                  name="categoria"
                  value={personalData.categoria}
                  onChange={handleChange}
                  className="editar-datos-laborales-input editable"
                >
                  <option value="">Seleccione una opción</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.nombre_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={personalData.categoria}
                  readOnly
                  className="editar-datos-laborales-input"
                />
              )}
            </div>

            {/* Fecha Alta */}
            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Fecha de alta:</p>
              <CalendarioInput
                value={personalData.fechaAlta}
                onChange={(fecha) =>
                  setPersonalData((prev) => ({ ...prev, fechaAlta: fecha }))
                }
              />
            </div>
          </div>

          {/* Segundo grupo */}
          <div className="editar-datos-laborales-group">
            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Hora de ingreso:</p>
              <HoraInput
                name="horaIngreso"
                value={personalData.horaIngreso}
                onChange={handleChange}
              />
            </div>

            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Hora de salida:</p>
              <HoraInput
                name="horaSalida"
                value={personalData.horaSalida}
                onChange={handleChange}
              />
            </div>

            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Cantidad de horas:</p>
              <input
                type="number"
                name="cantidadHoras"
                min={1}
                max={12}
                value={personalData.cantidadHoras}
                onChange={handleChange}
                className="editar-datos-laborales-input editable"
                placeholder="Ej: 8"
              />
            </div>

            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Tipo de contrato:</p>
              {isEditable ? (
                <select
                  name="tipoContrato"
                  value={personalData.tipoContrato}
                  onChange={handleChange}
                  className="editar-datos-laborales-input editable"
                >
                  <option value="">Seleccione una opción</option>
                  {opcionesTipoContrato.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={personalData.tipoContrato}
                  readOnly
                  className="editar-datos-laborales-input"
                />
              )}
            </div>

            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Estado:</p>
              {isEditable ? (
                <select
                  name="estado"
                  value={personalData.estado}
                  onChange={handleChange}
                  className="editar-datos-laborales-input editable"
                >
                  <option value="">Seleccione una opción</option>
                  {opcionesEstado.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={personalData.estado}
                  readOnly
                  className="editar-datos-laborales-input"
                />
              )}
            </div>

            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Semana laboral:</p>
              {isEditable ? (
                <select
                  name="tipoSemana"
                  value={personalData.tipoSemana}
                  onChange={handleChange}
                  className="editar-datos-laborales-input editable"
                >
                  <option value="">Seleccione una opción</option>
                  {opcionesSemanaLaboral.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={personalData.tipoSemana}
                  readOnly
                  className="editar-datos-laborales-input"
                />
              )}
            </div>

            <div className="editar-datos-laborales-item">
              <p className="editar-datos-laborales-label">Turno:</p>
              {isEditable ? (
                <select
                  name="turno"
                  value={personalData.turno}
                  onChange={handleChange}
                  className="editar-datos-laborales-input editable"
                >
                  <option value="">Seleccione una opción</option>
                  {opcionesTurno.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={personalData.turno}
                  readOnly
                  className="editar-datos-laborales-input"
                />
              )}
            </div>
          </div>
        </div>

        <div className="editar-datos-laborales-buttons">
          {isEditable ? (
            <>
              <button
                className="editar-datos-laborales-btn guardar"
                onClick={handleSave}
              >
                Guardar
              </button>
              <button
                className="editar-datos-laborales-btn cancelar"
                onClick={() => navegar("/administrador/empleados")}
                type="button"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className="editar-datos-laborales-btn editar"
              onClick={async () => {
                await cargarOpciones();
                setIsEditable(true);
              }}
            >
              Modificar Información
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
