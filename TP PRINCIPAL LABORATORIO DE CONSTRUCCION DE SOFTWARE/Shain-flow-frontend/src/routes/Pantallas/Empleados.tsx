// Versión modificada con campos: username, password y rol
import { useState, useEffect } from "react";
import "../../estilos/empleados.css";
import { listarEmpleados, crearEmpleado, crearUsuario } from "../../services/api";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
//import PaginatedList from "../../components/PaginatedListEmpleados";
import Paginacion from "../../components/Paginacion";
import { useUser } from '../../context/UserContext';

export interface Empleado {
  id_empleado: number;
  numero_identificacion: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  imagen_perfil_url?: string;
}

export const Empleados = () => {
  const { usuario } = useUser();

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [cargando, setCargando] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
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
    partido: "",
    provincia: "",
    genero: "",
    pais_nacimiento: "",
    estado_civil: "",
    username: "",
    password: "",
    rol: "",
  });

  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});
  const [mensajeError, setMensajeError] = useState<string>("");
  const navegar = useNavigate();

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        setCargando(true);
        const data = await listarEmpleados();

        // Excluir un empleado específico, por ejemplo el usuario logueado actual
        const empleadosFiltrados = data.filter(
          (empleado: Empleado) => empleado.id_empleado !== usuario?.id_empleado
        );

        setEmpleados(empleadosFiltrados);
      } catch (error) {
        console.error("Error al cargar empleados:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarEmpleados();
  }, []);

  const agregarDatos = () => {
    navegar("/administrador/agregar-datos");
  };
   const ConfiguracionAsistencia = () => {
    navegar("/administrador/configuracion-asistencia");
  };

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: false }));
  };

  const cargarEmpleado = async () => {
    const nuevosErrores: { [key: string]: boolean } = {};
    let esValido = true;

    Object.entries(nuevoEmpleado).forEach(([key, valor]) => {
      if (!valor.trim()) {
        nuevosErrores[key] = true;
        esValido = false;
      }
    });

    if (!esValido) {
      setErrores(nuevosErrores);
      setMensajeError(
        "Por favor, completa todos los campos antes de continuar."
      );
      return;
    }

    try {
      console.log("Enviando empleado:", nuevoEmpleado);
      const empleadoCreado = await crearEmpleado({
        nombre: nuevoEmpleado.nombre,
        apellido: nuevoEmpleado.apellido,
        tipo_identificacion: nuevoEmpleado.tipo_identificacion,
        numero_identificacion: nuevoEmpleado.numero_identificacion,
        fecha_nacimiento: nuevoEmpleado.fecha_nacimiento,
        correo_electronico: nuevoEmpleado.correo_electronico,
        telefono: nuevoEmpleado.telefono,
        calle: nuevoEmpleado.calle,
        numero_calle: nuevoEmpleado.numero_calle,
        localidad:  nuevoEmpleado.localidad,
        partido: nuevoEmpleado.partido,
        provincia: nuevoEmpleado.provincia,
        genero: nuevoEmpleado.genero,
        pais_nacimiento: nuevoEmpleado.pais_nacimiento,
        estado_civil: nuevoEmpleado.estado_civil,
        id_usuario: usuario?.id_empleado,
      });
      console.log("Empleado creado:", empleadoCreado);
      console.log(nuevoEmpleado.rol);
      
      const rolEmpleado = (nuevoEmpleado.rol == 'administrador' ? 2 :
      nuevoEmpleado.rol == 'empleado' ? 1 :
      nuevoEmpleado.rol == 'supervisor' ? 3 :
      nuevoEmpleado.rol == 'analista-datos' ? 4 : 2)

      await crearUsuario(
        empleadoCreado.id_empleado.id_empleado,
        rolEmpleado,
        nuevoEmpleado.username,
        nuevoEmpleado.password,
        "Creación de usuario para empleado",
      );

      setEmpleados((prev) => [
        ...prev,
        {
          id_empleado: empleadoCreado.id_empleado,
          numero_identificacion: empleadoCreado.numero_identificacion,
          nombre: empleadoCreado.nombre,
          apellido: empleadoCreado.apellido,
          correo: empleadoCreado.correo_electronico ?? empleadoCreado.correo,
          telefono: empleadoCreado.telefono,
          imagen_perfil_url: empleadoCreado.imagen_perfil_url || "",
        },
      ]);

      setMostrarFormulario(false);
      setNuevoEmpleado({
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
        partido: "",
        provincia: "",
        genero: "",
        pais_nacimiento: "",
        estado_civil: "",
        username: "",
        password: "",
        rol: "",
      });
      setErrores({});
      setMensajeError("");
    } catch (error) {
      console.error("Error al crear empleado:", error);
      setMensajeError("Error al crear el empleado. Intenta nuevamente.");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">👥 Empleados:</h2>
      <div className="titulo-con-botones">
        
        <div className="botones-superiores">
          {usuario?.permisos.editar_datos_personales &&
        (usuario.rol == "2") && (
          <button className="button-empleado" onClick={() => setMostrarFormulario(true)}>
            <span className="plus">➕</span> Agregar empleado
          </button>)}
        {usuario?.permisos.editar_datos_personales &&
        (usuario.rol == "2") && (
          <button className="button-empleado" onClick={agregarDatos}>
            <span className="plus">➕</span> Agregar datos
          </button>)}
                  {usuario?.permisos.editar_datos_personales &&
        (usuario.rol == "2") && (
          <button className="button-empleado" onClick={ConfiguracionAsistencia}>
            <span className="plus">➕</span> Configurar asistencias
          </button>)}
        </div>
      </div>

      {!mostrarFormulario && (
        <>
          {cargando && (
            <div className="overlay">
              <CircularProgress />
            </div>
          )}
          <Paginacion items={empleados} itemsPerPage={12} />
        </>
      )}

      {mostrarFormulario && (
        <div className="formulario-empleado">
          <h3>Formulario de nuevo empleado</h3>
          <form className="formulario-grid">
            {Object.entries(nuevoEmpleado).map(([campo, valor]) => {
              const label = campo
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
              const opciones: string[] =
                campo === "tipo_identificacion"
                  ? ["DNI", "Pasaporte", "Libreta Cívica"]
                  : campo === "provincia"
                  ? [
                      "Buenos Aires",
                      "Catamarca",
                      "Chaco",
                      "Chubut",
                      "Córdoba",
                      "Corrientes",
                      "Entre Ríos",
                      "Formosa",
                      "Jujuy",
                      "La Pampa",
                      "La Rioja",
                      "Mendoza",
                      "Misiones",
                      "Neuquén",
                      "Río Negro",
                      "Salta",
                      "San Juan",
                      "San Luis",
                      "Santa Cruz",
                      "Santa Fe",
                      "Santiago del Estero",
                      "Tierra del Fuego",
                      "Tucumán",
                    ]
                  : campo === "pais_nacimiento"
                  ? [
                      "Argentina",
                      "Uruguay",
                      "Paraguay",
                      "Chile",
                      "Bolivia",
                      "Perú",
                      "Ecuador",
                      "Colombia",
                      "Venezuela",
                      "Brasil",
                      "México"
                    ]
                  : campo==="genero"
                  ? ["Masculino", "Femenino", "No binario", "Prefiere no especificar", "Otro"]
                  : campo==="estado_civil"
                  ? ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"]
                  : campo === "rol"
                  ? [
                      "administrador",
                      "empleado",
                      "analista de datos",
                      "supervisor",
                    ]
                  : [];

              return (
                <div key={campo} className="form-group">
                  <label htmlFor={campo}>{label}</label>
                  {opciones.length > 0 ? (
                    <select
                      id={campo}
                      name={campo}
                      value={valor}
                      onChange={manejarCambio}
                      className={errores[campo] ? "input-error" : ""}
                    >
                      <option value="">Seleccione una opción</option>
                      {opciones.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={campo}
                      name={campo}
                      type={
                        campo.includes("password")
                          ? "password"
                          : campo === "fecha_nacimiento"
                          ? "date"
                          : "text"
                      }
                      value={valor}
                      onChange={manejarCambio}
                      className={errores[campo] ? "input-error" : ""}
                    />
                  )}
                </div>
              );
            })}
          </form>
          {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
          <div className="botones-formulario">
            <button className="button-empleado" onClick={cargarEmpleado}>✅ Cargar empleado</button>
            <button className="button-empleado" onClick={() => setMostrarFormulario(false)}>
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
