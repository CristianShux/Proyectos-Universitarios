import React, { useEffect, useState } from "react";
import {
  actualizarDatosEmpleado,
  enviarImg,
  obtenerEmpleadoPorIdentificacion,
  subirDocumentos,
  type ModificarData,
} from "../../services/api";
import CircularProgress from "@mui/material/CircularProgress";
import "../../estilos/datos-personales.css";
import { useUser } from "../../context/UserContext";

export interface PersonalDataType {
  id: string;
  nombre: string;
  apellido: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  fecha_nacimiento: string;
  correo_electronico: string;
  telefono: string;
  calle: string;
  numero_calle: string;
  localidad: string;
  provincia: string;
  pais_nacimiento: string;
  estado_civil: string;
  imagen_perfil_url: string; // Agregado para la imagen de perfil
}

let personaActualID: PersonalDataType;
let personaActualizada: boolean = false;

export const VerDatos = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const [mostrarMenuImagen, setMostrarMenuImagen] = useState(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const { usuario } = useUser();
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [mostrarMenuCV, setMostrarMenuCV] = useState(false);
  const [mostrarMenuTitulo, setMostrarMenuTitulo] = useState(false);
  const [archivoCV, setArchivoCV] = useState<File | null>(null);
  const [archivoTitulo, setArchivoTitulo] = useState<File | null>(null);

  const manejarVerImagen = () => {
    if (imagenPerfil || personalData.imagen_perfil_url) {
      setMostrarVistaPrevia(true);
      setMostrarMenuImagen(false);
    }
  };

  const manejarCambiarImagen = () => {
    document.getElementById("input-foto")?.click();
    setMostrarMenuImagen(false);
  };

  const toggleMenuCV = () => {
    setMostrarMenuCV(!mostrarMenuCV);
    setMostrarMenuTitulo(false);
  };

  const toggleMenuTitulo = () => {
    setMostrarMenuTitulo(!mostrarMenuTitulo);
    setMostrarMenuCV(false);
  };

  const manejarVerCV = async () => {
    if (!usuario?.id_empleado) return;
    const url = `https://render-crud-jc22.onrender.com/api/documentos/CV/${usuario.id_empleado}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("No se pudo obtener el CV");

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (data?.url) {
        const response = await fetch(data.url);
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "cv.pdf"; // o "titulo.pdf"
        link.click();
      } else {
        console.warn("El campo 'url' no está presente en la respuesta");
      }
    } catch (err) {
      console.error("Error al obtener el CV:", err);
    }
  };
  

  const manejarVerTitulo = async () => {
    if (!usuario?.id_empleado) return;
    const url = `https://render-crud-jc22.onrender.com/api/documentos/Título/${usuario.id_empleado}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("No se pudo obtener el Título");

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (data?.url) {
        const response = await fetch(data.url);
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "título.pdf";
        link.click();
      } else {
        console.warn("El campo 'url' no está presente en la respuesta");
      }
    } catch (err) {
      console.error("Error al obtener el título:", err);
    }
  };

  const manejarCargarCV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setArchivoCV(file);
      console.log("Archivo CV seleccionado:", file.name);
      // Aquí iría lógica de envío
    }
  };

  const manejarCargarTitulo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setArchivoTitulo(file);
      console.log("Archivo título seleccionado:", file.name);
      // Aquí iría lógica de envío
    }
  };

  const [personalData, setPersonalData] = useState<PersonalDataType>({
    id: "",
    nombre: "",
    apellido: "",
    tipo_identificacion: "",
    numero_identificacion: "",
    fecha_nacimiento: "",
    correo_electronico: "",
    telefono: "",
    calle: "",
    numero_calle: "",
    localidad: "",
    provincia: "",
    pais_nacimiento: "",
    estado_civil: "",
    imagen_perfil_url: "",
  });

  const fetchData = async () => {
    if (!usuario || !usuario.numero_identificacion) {
      console.error(
        "Usuario no encontrado o número de identificación no disponible."
      );
      console.log(personaActualID);

      return personaActualID;
    }
    try {
      setCargando(true);
      const data = await obtenerEmpleadoPorIdentificacion(
        usuario.numero_identificacion
      );
      setPersonalData(data);
      if (!personaActualizada) {
        personaActualID = data;
        personaActualizada = true;
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setCargando(true);

      const data: ModificarData = {
        telefono: personalData.telefono,
        correo_electronico: personalData.correo_electronico,
        calle: personalData.calle,
        numero_calle: personalData.numero_calle,
        localidad: personalData.localidad,
        partido: "",
        provincia: personalData.provincia,
      };

      // Enviar imagen si fue cambiada
      if (imagenArchivo) {
        await enviarImg(imagenArchivo, JSON.stringify(usuario?.id_empleado));
        console.log("Imagen enviada correctamente.");
      }

      if (archivoTitulo) {
        const data = await subirDocumentos({
          archivo: archivoTitulo,
          tipo: "Título",
          empleado_id: usuario?.id_empleado || 1,
          descripcion: "Título académico"
        })
        console.log("Subido título con éxito:", data);
      }
      if (archivoCV) {
        console.log("Archivo a enviar:", archivoCV);
        console.log("Tipo MIME:", archivoCV?.type);

        const data = await subirDocumentos({
          archivo: archivoCV,
          tipo: "CV",
          empleado_id: usuario?.id_empleado || 1,
          descripcion: "Currículum vitae"
        })
        console.log("Subido CV con éxito:", data);
      }

      // Actualizar los datos personales
      await actualizarDatosEmpleado(JSON.stringify(usuario?.id_empleado), data);
      console.log("Datos actualizados correctamente.");

      await fetchData();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    } finally {
      setCargando(false);
      setIsEditable(false);
    }
  };
  const handleCancel = () => {
    setIsEditable(false);
    fetchData();
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenArchivo(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagenPerfil(reader.result as string); // Solo para vista previa
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container-personal-data" style={{ position: "relative" }}>
      {cargando && (
        <div className="overlay">
          <CircularProgress />
        </div>
      )}

      <div
        className="personal-data"
        style={{ filter: cargando ? "blur(2px)" : "none" }}
      >
        <h2 className="title">Información personal</h2>

        {/* Imagen circular */}
        <div
          className="cont-img-perfil"
          
        >
          <div
            className="foto-perfil"
            style={{
              cursor:
                isEditable || imagenPerfil || personalData.imagen_perfil_url
                  ? "pointer"
                  : "default",
              }}
            onClick={() => {
              if (
                isEditable ||
                imagenPerfil ||
                personalData.imagen_perfil_url
              ) {
                setMostrarMenuImagen((prev) => !prev);
              }
            }}
          >
            {imagenPerfil || personalData.imagen_perfil_url ? (
              <img
                src={imagenPerfil || personalData.imagen_perfil_url}
                alt="Foto de perfil"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  color: "#999",
                  textAlign: "center",
                  fontSize: "13px",
                  padding: "10px",
                }}
              >
                Agregar foto
              </span>
            )}
            <input
              type="file"
              id="input-foto"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImagenChange}
            />
          </div>

          {mostrarMenuImagen && (
            <div
              style={{
                marginTop: "5px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                width: "140px",
                zIndex: 1000,
                position: "absolute",
                right: 0,
              }}
            >
              <button
                style={{
                  padding: "10px",
                  width: "100%",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
                onClick={manejarVerImagen}
                disabled={!imagenPerfil && !personalData.imagen_perfil_url}
              >
                Ver imagen
              </button>
              {isEditable && (
                <button
                  style={{
                    padding: "10px",
                    width: "100%",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  onClick={manejarCambiarImagen}
                >
                  Cambiar imagen
                </button>
              )}
            </div>
          )}
        </div>

        <div className="data-container">
          <div className="data-group">
            {[
              { label: "Nombre/s", name: "nombre" },
              { label: "Apellido/s", name: "apellido" },
              {
                label: personalData.tipo_identificacion,
                name: "numero_identificacion",
              },
              { label: "Fecha de nacimiento", name: "fecha_nacimiento" },
            ].map(({ label, name }) => (
              <div className="data-item" key={name}>
                <p className="data-item--label">{label}:</p>
                <input
                  className="data-item--value"
                  type="text"
                  name={name}
                  value={(personalData as any)[name]}
                  readOnly
                />
              </div>
            ))}
          </div>

          <div className="data-group">
            {[
              { label: "Email", name: "correo_electronico", type: "email" },
              { label: "Teléfono", name: "telefono", type: "tel" },
              { label: "Calle", name: "calle" },
              { label: "Número", name: "numero_calle" },
              { label: "País de nacimiento", name: "pais_nacimiento" },
              { label: "Provincia", name: "provincia" },
              { label: "Localidad", name: "localidad" },
              { label: "Estado", name: "estado_civil" },
            ].map(({ label, name, type = "text" }) => (
              <div className="data-item" key={name}>
                <p className="data-item--label">{label}:</p>
                <input
                  className={`data-item--value ${isEditable ? "editable" : ""}`}
                  type={type}
                  name={name}
                  value={(personalData as any)[name] || ""}
                  onChange={handleChange}
                  readOnly={!isEditable}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <div style={{ position: "relative" }}>
            <button className="boton-opcion" onClick={toggleMenuCV}>
              CV ⬇
            </button>
            {mostrarMenuCV && (
              <div
                className="menu-opciones"
                style={{ top: !isEditable ? "-50px" : "-100px", right: "0" }}
              >
                <button
                  className="opcion-menu"
                  onClick={manejarVerCV}
                  disabled={!archivoCV}
                  title={!archivoCV ? "No hay CV cargado" : ""}
                >
                  Ver CV
                </button>
                {isEditable && (
                  <>
                    <button
                      className="opcion-menu"
                      onClick={() =>
                        document.getElementById("input-cv")?.click()
                      }
                    >
                      Cargar CV
                    </button>
                    <input
                      type="file"
                      id="input-cv"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      onChange={manejarCargarCV}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button className="boton-opcion" onClick={toggleMenuTitulo}>
              Título ⬇
            </button>
            {mostrarMenuTitulo && (
              <div
                className="menu-opciones"
                style={{ top: !isEditable ? "-50px" : "-100px", right: "0" }}
              >
                <button
                  className="opcion-menu"
                  onClick={manejarVerTitulo}
                  disabled={!archivoTitulo}
                  // disabled={!cv_url} DEL BACKEND
                  title={!archivoTitulo ? "No hay título cargado" : ""}
                >
                  Ver Título
                </button>
                {isEditable && (
                  <>
                    <button
                      className="opcion-menu"
                      onClick={() =>
                        document.getElementById("input-titulo")?.click()
                      }
                    >
                      Cargar Título
                    </button>
                    <input
                      type="file"
                      id="input-titulo"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      onChange={manejarCargarTitulo}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className="button-container"
          style={{ marginTop: isEditable ? "20px" : "40px" }}
        >
          {!isEditable ? (
            <button className="edit-button" onClick={() => setIsEditable(true)}>
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

      {mostrarVistaPrevia && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setMostrarVistaPrevia(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              background: "transparent",
              color: "#fff",
              fontSize: "30px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ×
          </button>
          <img
            src={imagenPerfil || personalData.imagen_perfil_url || ""}
            alt="Vista previa"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
            }}
          />
        </div>
      )}
    </div>
  );
};
