import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./estilos/inasistencia.css";
import { useNavigate, useParams } from "react-router-dom";

type FormData = {
  fecha: Date | null;
  dia: string;
  tipo: string;
  descripcion: string;
};

const tiposInasistencia = [
  "Falta justificada",
  "Falta no justificada",
  "Licencia médica",
  "Vacaciones",
  "Suspensión",
  "No laboral",
  "Otra",
];

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const Inasistencia: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const navegar = useNavigate();
  const { id_empleado } = useParams<{ id_empleado: string }>();

  const handleFechaChange = (date: Date | null) => {
    setFechaSeleccionada(date);
    if (date) {
      setValue("fecha", date);
    }
  };

  const handleDiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dia = e.target.value;
    if (dia) {
      setValue("dia", dia);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!id_empleado) {
      alert("❌ No se encontró el ID del empleado");
      return;
    }

    const payload = {
      id_empleado: Number(id_empleado),
      fecha: data.fecha?.toISOString().split("T")[0], // Formato YYYY-MM-DD
      dia: data.dia,
      tipo: data.tipo,
      descripcion: data.descripcion,
    };

    try {
      const response = await fetch("https://render-crud-jc22.onrender.com/registrar-incidencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          alert(`⚠️ No se pudo registrar la inasistencia: ${resData.detail}`);
        } else {
          alert(`❌ Error inesperado: ${resData.detail || "Intenta nuevamente."}`);
        }
        return;
      }

      alert("✅ Inasistencia registrada correctamente.");
      navegar("/administrador/empleados");
    } catch (error) {
      console.error("❌ Error de red o servidor:", error);
      alert("❌ Ocurrió un error de red. Intenta más tarde.");
    }
  };

  return (
    <div className="form-inasistencia">
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h2 className="inasistencia__titulo">Registrar inasistencia</h2>
        <p className="inasistencia__subtitulo">
          Ingresá los detalles de la inasistencia del empleado.
        </p>

        <div className="cont-campos">
          <div>
            <label>Fecha:</label>
            <DatePicker
              selected={fechaSeleccionada}
              onChange={handleFechaChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Elige una fecha"
            />
            <input
              type="hidden"
              {...register("fecha", { required: "La fecha es obligatoria" })}
            />
            {errors.fecha && <span>{errors.fecha.message}</span>}
          </div>

          <div>
            <label>Día:</label>
            <select
              id="dia"
              name="dia"
              className="data-item--value"
              onChange={handleDiaChange}
            >
              <option value="">Seleccione una opción</option>
              {diasSemana.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
            <input
              type="hidden"
              {...register("dia", { required: "El día es obligatorio" })}
            />
            {errors.dia && <span>{errors.dia.message}</span>}
          </div>

          <div>
            <label>Tipo de inasistencia:</label>
            <select
              className="data-item--value"
              {...register("tipo", { required: "El tipo es obligatorio" })}
            >
              <option value="">Seleccionar...</option>
              {tiposInasistencia.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            {errors.tipo && <span>{errors.tipo.message}</span>}
          </div>

          <div>
            <label>Descripción:</label>
            <textarea
              className="data-textarea"
              {...register("descripcion", { required: "La descripción es obligatoria" })}
            />
            {errors.descripcion && <span>{errors.descripcion.message}</span>}
          </div>

          <div className="botones-formulario">
            <button type="submit" className="btn-inasistencia-registrar">
              ✅ Permitir
            </button>
            <button
              type="button"
              className="btn-inasistencia-cancelar "
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

export default Inasistencia;
