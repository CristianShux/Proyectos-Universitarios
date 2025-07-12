import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./estilos/AsistenciaUnica.css";
import { useNavigate, useParams } from "react-router-dom";
import HoraInput from "../components/Hora";

type FormData = {
  fecha: Date | null;
  tipo: string;
  hora: string;
  estado_asistencia: string;
  turno_asistencia: string;
};

const tipos = ["Entrada", "Salida"];
const estadosAsistencia = ["A tiempo", "Tarde", "Temprana", "Retraso minimo", "Fuera de rango"];
const turnos = ["Mañana", "Tarde","Noche"];

const AsistenciaUnica: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>();

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>(
    new Date().toTimeString().slice(0, 5)
  );

  const navegar = useNavigate();
  const { id_empleado } = useParams<{ id_empleado: string }>();

  const handleFechaChange = (date: Date | null) => {
    setFechaSeleccionada(date);
    if (date) setValue("fecha", date);
  };

  const handleHoraChange = (e: { target: { value: string } }) => {
    setHoraSeleccionada(e.target.value);
    setValue("hora", e.target.value);
  };

  const onSubmit = async (data: FormData) => {
    if (!id_empleado) {
      alert("❌ No se encontró el ID del empleado");
      return;
    }

    const payload = {
      id_empleado: Number(id_empleado),
      fecha: data.fecha?.toISOString().split("T")[0],
      tipo: data.tipo,
      hora: data.hora,
      estado_asistencia: data.estado_asistencia,
      turno_asistencia: data.turno_asistencia,
    };

    try {
      const response = await fetch("https://render-crud-jc22.onrender.com/registrar-asistenciaBiometrica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          alert(`⚠️ No se pudo registrar la asistencia: ${resData.detail}`);
        } else {
          alert(`❌ Error inesperado: ${resData.detail || "Intenta nuevamente."}`);
        }
        return;
      }

      alert("✅ Asistencia registrada correctamente.");
      navegar("/administrador/empleados");
    } catch (error) {
      console.error("❌ Error de red o servidor:", error);
      alert("❌ Ocurrió un error de red. Intenta más tarde.");
    }
  };

  return (
    <div className="form-asistencia-unica">
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h2 className="asistencia-unica__titulo">Registrar asistencia manual</h2>
        <p className="asistencia-unica__subtitulo">
          Ingresá manualmente una entrada o salida del empleado.
        </p>

        <div className="cont-campos">
          <div>
            <label>Fecha:</label>
            <DatePicker
              selected={fechaSeleccionada}
              onChange={handleFechaChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Seleccionar fecha"
            />
            <input type="hidden" {...register("fecha", { required: "La fecha es obligatoria" })} />
            {errors.fecha && <span>{errors.fecha.message}</span>}
          </div>

          <div>
            <label>Tipo:</label>
            <select {...register("tipo", { required: "El tipo es obligatorio" })} className="data-item--value">
              <option value="">Seleccionar...</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            {errors.tipo && <span>{errors.tipo.message}</span>}
          </div>

          <div>
            <label>Hora:</label>
            <HoraInput
              name="hora"
              value={horaSeleccionada}
              onChange={handleHoraChange}
            />
            <input type="hidden" {...register("hora", { required: "La hora es obligatoria" })} />
            {errors.hora && <span>{errors.hora.message}</span>}
          </div>

          <div>
            <label>Estado de asistencia:</label>
            <select {...register("estado_asistencia", { required: "El estado es obligatorio" })} className="data-item--value">
              <option value="">Seleccionar...</option>
              {estadosAsistencia.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            {errors.estado_asistencia && <span>{errors.estado_asistencia.message}</span>}
          </div>

          <div>
            <label>Turno:</label>
            <select {...register("turno_asistencia", { required: "El turno es obligatorio" })} className="data-item--value">
              <option value="">Seleccionar...</option>
              {turnos.map((turno) => (
                <option key={turno} value={turno}>{turno}</option>
              ))}
            </select>
            {errors.turno_asistencia && <span>{errors.turno_asistencia.message}</span>}
          </div>

          <div className="botones-formulario">
            <button type="submit" className="btn-registrar">
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
      </form>
    </div>
  );
};

export default AsistenciaUnica;