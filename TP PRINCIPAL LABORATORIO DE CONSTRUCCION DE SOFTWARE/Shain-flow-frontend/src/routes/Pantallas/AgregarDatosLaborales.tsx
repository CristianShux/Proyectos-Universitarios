import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CalendarioInput from "../../components/Calendario";
import HoraInput from "../../components/Hora";

interface PersonalDataType {
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

// Hook genérico para cargar opciones desde endpoint
function useFetchOptions<T>(url: string) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar datos");
        return res.json();
      })
      .then((data) => setOptions(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { options, loading, error };
}

export const AgregarDatosLaborales = () => {
  const { id_empleado } = useParams<{ id_empleado: string }>();
  const navegar = useNavigate();

  const [personalData, setPersonalData] = useState<PersonalDataType>({
    departamento: "",
    puesto: "",
    categoria: "",
    fechaAlta: "2002-04-01",
    horaIngreso: "08:00",
    horaSalida: "16:00",
    cantidadHoras: "08:00",
    tipoContrato: "Tiempo indeterminado",
    estado: "Activo",
    tipoSemana: "Normal",
    turno: "Mañana",
  });

  const handleChange = (e: { target: { name?: string; value: string } }) => {
    const { name, value } = e.target;
    if (!name) return;

    setPersonalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- INICIO handleSave modificado para POST ---
  const handleSave = async () => {
    if (!id_empleado) {
      alert("ID de empleado no válido");
      return;
    }

    // Buscar los IDs a partir de los nombres seleccionados
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
      alert("Debe seleccionar departamento, puesto y categoría válidos");
      return;
    }

const cantidadHorasInt = parseInt(personalData.cantidadHoras);

    const payload = {
      id_empleado: parseInt(id_empleado),
      id_departamento: departamentoSeleccionado.id_departamento,
      id_puesto: puestoSeleccionado.id_puesto,
      id_categoria: categoriaSeleccionada.id_categoria,
      fecha_ingreso: personalData.fechaAlta,
      turno: personalData.turno,
      hora_inicio_turno: personalData.horaIngreso,
      hora_fin_turno: personalData.horaSalida,
      cantidad_horas_trabajo: cantidadHorasInt,
      tipo_contrato: personalData.tipoContrato,
      estado: personalData.estado,
      tipo_semana_laboral: personalData.tipoSemana,
    };
console.log("Payload enviado:", payload);
    try {
      const res = await fetch(
        "https://render-crud-jc22.onrender.com/api/informacion-laboral/agregar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.detail || "No se pudo guardar la información"));
        return;
      }

      alert("Información laboral guardada correctamente");
      navegar("/administrador/empleados");
    } catch (error) {
      alert("Error de red");
      console.error(error);
    }
  };
  // --- FIN handleSave modificado ---

  // Cargar datos dinámicos
  const { options: departamentos } = useFetchOptions<{
    id_departamento: number;
    nombre: string;
  }>("https://render-crud-jc22.onrender.com/api/departamentos/");
  const { options: puestos } = useFetchOptions<{
    id_puesto: number;
    nombre: string;
  }>("https://render-crud-jc22.onrender.com/api/puestos/");
  const { options: categorias } = useFetchOptions<{
    id_categoria: number;
    nombre_categoria: string;
  }>("https://render-crud-jc22.onrender.com/api/categorias/");

  // Opciones estáticas (pueden quedar igual)
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

  return (
    <div className="container-personal-data-edit">
      <div className="personal-data-edit">
        <h2 className="title">Información laboral</h2>

        <div className="data-container-edit">
          <div className="data-group">
            <div className="data-item">
              <p className="data-item--label">Departamento:</p>
              <select
                name="departamento"
                value={personalData.departamento}
                onChange={handleChange}
                className="data-item--value editable"
              >
                <option value="">Seleccione una opción</option>
                {departamentos.map((dep) => (
                  <option key={dep.id_departamento} value={dep.nombre}>
                    {dep.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="data-item">
              <p className="data-item--label">Puesto:</p>
              <select
                name="puesto"
                value={personalData.puesto}
                onChange={handleChange}
                className="data-item--value editable"
              >
                <option value="">Seleccione una opción</option>
                {puestos.map((pue) => (
                  <option key={pue.id_puesto} value={pue.nombre}>
                    {pue.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="data-item">
              <p className="data-item--label">Categoría:</p>
              <select
                name="categoria"
                value={personalData.categoria}
                onChange={handleChange}
                className="data-item--value editable"
              >
                <option value="">Seleccione una opción</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.nombre_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="data-item">
              <p className="data-item--label">Fecha de alta:</p>
              <CalendarioInput
                value={personalData.fechaAlta}
                onChange={(fecha) =>
                  setPersonalData((prev) => ({ ...prev, fechaAlta: fecha }))
                }
              />
            </div>
          </div>

          <div className="data-group">
            <div className="data-item">
              <p className="data-item--label">Hora de ingreso:</p>
              <HoraInput
                name="horaIngreso"
                value={personalData.horaIngreso}
                onChange={handleChange}
              />
            </div>

            <div className="data-item">
              <p className="data-item--label">Hora de salida:</p>
              <HoraInput
                name="horaSalida"
                value={personalData.horaSalida}
                onChange={handleChange}
              />
            </div>

            <div className="data-item">
              <p className="data-item--label">Cantidad de horas:</p>
              <input
                type="number"
                name="cantidadHoras"
                min={1}
                max={12}
                value={personalData.cantidadHoras}
                onChange={handleChange}
                className="data-item--value editable"
                placeholder="Ej: 8"
              />
            </div>

            <div className="data-item">
              <p className="data-item--label">Tipo de contrato:</p>
              <select
                name="tipoContrato"
                value={personalData.tipoContrato}
                onChange={handleChange}
                className="data-item--value editable"
              >
                <option value="">Seleccione una opción</option>
                {opcionesTipoContrato.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="data-item">
              <p className="data-item--label">Estado:</p>
              <select
                name="estado"
                value={personalData.estado}
                onChange={handleChange}
                className="data-item--value editable"
              >
                <option value="">Seleccione una opción</option>
                {opcionesEstado.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="data-item">
              <p className="data-item--label">Semana laboral:</p>
              <select
                name="tipoSemana"
                value={personalData.tipoSemana}
                onChange={handleChange}
                className="data-item--value editable"
              >
                <option value="">Seleccione una opción</option>
                {opcionesSemanaLaboral.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="data-item">
              <p className="data-item--label">Turno:</p>
              <select
                name="turno"
                value={personalData.turno}
                onChange={handleChange}
                className="data-item--value editable"
              >
                <option value="">Seleccione una opción</option>
                {opcionesTurno.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button className="save-button" onClick={handleSave}>
            Guardar
          </button>
          <button
            className="cancel-button"
            onClick={() => navegar("/administrador/empleados")}
            type="button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
