import React, { useState, useEffect } from "react";
import "../../estilos/datos-personales.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  actualizarDatosEmpleado,
  obtenerEmpleadoPorIdentificacion,
} from "../../services/api";
import { EditarDatosLaborales } from "./EditarDatosLaborales";

interface PersonalDataType {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  calle: string;
  numero: string;
  nacionalidad: string;
  provincia: string;
  localidad: string;
  estado: string;
}

export const EditarEmpleado = () => {
  const location = useLocation();
  const empleado = location.state;
  const empleadoId = empleado.id_empleado;
  const navegar = useNavigate();

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [seccionActiva, setSeccionActiva] = useState<
    "personales" | "laborales"
  >("personales");

  const [personalData, setPersonalData] = useState<PersonalDataType>({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    email: "",
    telefono: "",
    calle: "",
    numero: "",
    nacionalidad: "",
    provincia: "",
    localidad: "",
    estado: "",
  });

  const opcionesEstadoCivil = [
    "Soltero/a",
    "Casado/a",
    "Divorciado/a",
    "Viudo/a",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!empleadoId) {
      console.error("ID del empleado no encontrado.");
      return;
    }
    try {
      const nuevosDatos = {
        telefono: personalData.telefono,
        correo_electronico: personalData.email,
        calle: personalData.calle,
        numero_calle: personalData.numero,
        localidad: personalData.localidad,
        partido: "",
        provincia: personalData.provincia,
      };
      await actualizarDatosEmpleado(JSON.stringify(empleadoId), nuevosDatos);
      console.log("Datos actualizados exitosamente.");
      setIsEditable(false);
      navegar("/administrador/empleados");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  const handleCancel = async () => {
    setIsEditable(false);
    const datos = await obtenerEmpleadoPorIdentificacion(
      empleado.numero_identificacion
    );
    setPersonalData({
      nombre: datos.nombre,
      apellido: datos.apellido,
      dni: datos.numero_identificacion,
      fechaNacimiento: datos.fecha_nacimiento,
      email: datos.correo_electronico,
      telefono: datos.telefono,
      calle: datos.calle,
      numero: datos.numero_calle,
      nacionalidad: datos.pais_nacimiento,
      provincia: datos.provincia,
      localidad: datos.localidad,
      estado: datos.estado_civil,
    });
  };

  useEffect(() => {
    if (!empleado?.numero_identificacion) return;
    const cargarDatosEmpleado = async () => {
      try {
        const datos = await obtenerEmpleadoPorIdentificacion(
          empleado.numero_identificacion
        );
        setPersonalData({
          nombre: datos.nombre,
          apellido: datos.apellido,
          dni: datos.numero_identificacion,
          fechaNacimiento: datos.fecha_nacimiento,
          email: datos.correo_electronico,
          telefono: datos.telefono,
          calle: datos.calle,
          numero: datos.numero_calle,
          nacionalidad: datos.pais_nacimiento,
          provincia: datos.provincia,
          localidad: datos.localidad,
          estado: datos.estado_civil,
        });
      } catch (error) {
        console.error("Error al obtener los datos del empleado:", error);
      }
    };
    cargarDatosEmpleado();
  }, [empleado?.numero_identificacion]);

  return (
    <div className="container-personal-data-edit">
      <div className="personal-data-edit">
        <div className="tabs-container">
          <button
            className={seccionActiva === "personales" ? "tab active" : "tab"}
            onClick={() => setSeccionActiva("personales")}
          >
            Datos Personales
          </button>
          <button
            className={seccionActiva === "laborales" ? "tab active" : "tab"}
            onClick={() => setSeccionActiva("laborales")}
          >
            Información Laboral
          </button>
        </div>

        {seccionActiva === "personales" ? (
          <div className="personal-data-edit">
            <h2 className="title">Información personal</h2>
            <div className="data-container-edit">
              <div className="data-group">
                <div className="data-item">
                  <p className="data-item--label">Nombre/s:</p>
                  <input
                    className="data-item--value"
                    type="text"
                    name="nombre"
                    value={personalData.nombre}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">Apellido/s:</p>
                  <input
                    className="data-item--value"
                    type="text"
                    name="apellido"
                    value={personalData.apellido}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">DNI:</p>
                  <input
                    className="data-item--value"
                    type="number"
                    name="dni"
                    value={personalData.dni}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">Fecha de nacimiento:</p>
                  <input
                    className="data-item--value"
                    type="text"
                    name="fechaNacimiento"
                    value={personalData.fechaNacimiento}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              <div className="data-group">
                <div className="data-item">
                  <p className="data-item--label">Email:</p>
                  <input
                    className={`data-item--value ${
                      isEditable ? "editable" : ""
                    }`}
                    type="email"
                    name="email"
                    value={personalData.email}
                    onChange={handleChange}
                    readOnly={!isEditable}
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">Teléfono:</p>
                  <input
                    className={`data-item--value ${
                      isEditable ? "editable" : ""
                    }`}
                    type="tel"
                    name="telefono"
                    value={personalData.telefono}
                    onChange={handleChange}
                    readOnly={!isEditable}
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">Calle:</p>
                  <input
                    className={`data-item--value ${
                      isEditable ? "editable" : ""
                    }`}
                    type="text"
                    name="calle"
                    value={personalData.calle}
                    onChange={handleChange}
                    readOnly={!isEditable}
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">Número:</p>
                  <input
                    className={`data-item--value ${
                      isEditable ? "editable" : ""
                    }`}
                    type="text"
                    name="numero"
                    value={personalData.numero}
                    onChange={handleChange}
                    readOnly={!isEditable}
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">País de nacimiento:</p>
                  <input
                    className="data-item--value"
                    type="text"
                    name="nacionalidad"
                    value={personalData.nacionalidad}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">Provincia:</p>
                  <input
                    className={`data-item--value ${
                      isEditable ? "editable" : ""
                    }`}
                    type="text"
                    name="provincia"
                    value={personalData.provincia}
                    onChange={handleChange}
                    readOnly={!isEditable}
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">Localidad:</p>
                  <input
                    className={`data-item--value ${
                      isEditable ? "editable" : ""
                    }`}
                    type="text"
                    name="localidad"
                    value={personalData.localidad}
                    onChange={handleChange}
                    readOnly={!isEditable}
                  />
                </div>
                <div className="data-item">
                  <p className="data-item--label">Estado:</p>
                  {isEditable ? (
                    <select
                      className="data-item--value editable"
                      name="estado"
                      value={personalData.estado}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione una opción</option>
                      {opcionesEstadoCivil.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="data-item--value"
                      type="text"
                      name="estado"
                      value={personalData.estado}
                      readOnly
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="button-container">
              {!isEditable ? (
                <button
                  className="edit-button"
                  onClick={() => setIsEditable(true)}
                >
                  Modificar Información
                </button>
              ) : (
                <>
                  <button className="save-button" onClick={handleSave}>
                    Guardar
                  </button>
                  <button className="cancel-button" onClick={handleCancel}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <EditarDatosLaborales idEmpleado={empleadoId} />
        )}
      </div>
    </div>
  );
};
