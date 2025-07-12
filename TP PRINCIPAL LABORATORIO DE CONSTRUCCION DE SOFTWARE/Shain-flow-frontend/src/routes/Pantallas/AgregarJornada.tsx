import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CalendarioInput from "../../components/Calendario";
import HoraInput from "../../components/Hora";
import "../../estilos/AgregarJornada.css";

interface PersonalDataType {
  fecha: string;
  hora_ingreso: string;
  hora_egreso: string;
  motivo: string;
  dia: string;
  estado: string;
  horas_normales: string;
  horas_extra: string;
}

export const AgregarJornada = () => {
  const navegar = useNavigate();
  const { id_empleado } = useParams<{ id_empleado: string }>();

  const [personalData, setPersonalData] = useState<PersonalDataType>({
    fecha: "",
    hora_ingreso: "08:00",
    hora_egreso: "16:00",
    motivo: "",
    dia: "",
    estado: "",
    horas_normales: "8",
    horas_extra: "0",
  });

  const handleChange = (e: { target: { name?: string; value: string } }) => {
    const { name, value } = e.target;
    if (!name) return;

    if (
      (name === "horas_normales" || name === "horas_extra") &&
      !/^\d*$/.test(value)
    ) {
      return;
    }

    setPersonalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const manejarFecha = (fechaStr: string) => {
    setPersonalData((prevData) => ({
      ...prevData,
      fecha: fechaStr,
    }));
  };

  const registrarJornada = async () => {
    const jornada = {
      id_empleado: Number(id_empleado),
      fecha: personalData.fecha,
      dia: personalData.dia,
      hora_entrada: personalData.hora_ingreso,
      hora_salida: personalData.hora_egreso,
      estado_jornada: personalData.estado,
      horas_normales_trabajadas: Number(personalData.horas_normales),
      horas_extra: Number(personalData.horas_extra),
      motivo: personalData.motivo,
    };

    try {
      const response = await fetch(
        "https://render-crud-jc22.onrender.com/registrar-jornada",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jornada),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          alert(`⚠️ No se pudo registrar la jornada: ${data.detail}`);
        } else {
          alert(`❌ Error inesperado: ${data.detail || "Intenta nuevamente."}`);
        }
        return;
      }

      alert("✅ Jornada registrada correctamente.");
      navegar("/administrador/empleados");
    } catch (error) {
      console.error("❌ Error de red o servidor:", error);
      alert("❌ Ocurrió un error de red. Intenta más tarde.");
    }
  };

  const opcionesDia = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const opcionesEstado = ["Completa", "Completa con horas extra", "Incompleta"];

  return (
    <div className="agregar-jornada">
      <div className="form-container">
        <h2 className="title">Agregar Jornada</h2>
        <div className="data-group">
          <div className="data-item">
            <label>Fecha:</label>
            <CalendarioInput
              value={personalData.fecha}
              onChange={manejarFecha}
            />
          </div>
          <div className="data-item">
            <label>Hora de ingreso:</label>
            <HoraInput
              name="hora_ingreso"
              value={personalData.hora_ingreso}
              onChange={handleChange}
            />
          </div>
          <div className="data-item">
            <label>Hora de egreso:</label>
            <HoraInput
              name="hora_egreso"
              value={personalData.hora_egreso}
              onChange={handleChange}
            />
          </div>
          <div className="data-item">
            <label>Motivo:</label>
            <input
              type="text"
              name="motivo"
              value={personalData.motivo}
              onChange={handleChange}
            />
          </div>
          <div className="data-item">
            <label>Día:</label>
            <select name="dia" value={personalData.dia} onChange={handleChange}>
              <option value="">Seleccione un día</option>
              {opcionesDia.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>
          <div className="data-item">
            <label>Estado:</label>
            <select
              name="estado"
              value={personalData.estado}
              onChange={handleChange}
            >
              <option value="">Seleccione un estado</option>
              {opcionesEstado.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>
          <div className="data-item">
            <label>Horas normales:</label>
            <input
              type="number"
              name="horas_normales"
              value={personalData.horas_normales}
              onChange={handleChange}
              min={0}
              step={1}
            />
          </div>
          <div className="data-item">
            <label>Horas extra:</label>
            <input
              type="number"
              name="horas_extra"
              value={personalData.horas_extra}
              onChange={handleChange}
              min={0}
              step={1}
            />
          </div>
        </div>

        <div className="botones-formulario">
          <button
            type="submit"
            className="btn-registrar"
            onClick={registrarJornada}
          >
            ✅ Permitir
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navegar("/administrador/empleados")}
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
