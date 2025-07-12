import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DefaultLayout from "../../components/DefaultLayout";
import { NavLink } from "react-router-dom";
import "../../estilos/signup.css";
import { crearEmpleado2, crearUsuario } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { useEffect } from 'react';

export interface Credenciales {
  username: string;
  password: string;
  confirmPassword: string;
  rol: string;
}

export interface DatosEmpleado {
  nombre: string;
  apellido: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  correo_electronico: string;
  pais_nacimiento: string;
  calle: string;
  numero_calle: string;
  localidad: string;
  partido: string;
  provincia: string;
  fecha_nacimiento: string;
  telefono: string;
  genero: string;
  estado_civil: string;
}

interface CredentialFormProps extends Credenciales {
  onChange: (campo: keyof Credenciales, valor: string) => void;
}

interface Partido {
  codigo_partido: string;
  codigo_provincia: number;
  nombre: string;
}

interface Provincia {
  codigo_provincia: number;
  nombre: string;
}

interface Localidad {
  codigo_localidad: string;
  codigo_provincia: number;
  nombre: string;
}

interface Pais {
  codigo_pais: string;
  nombre: string;
}


const CredentialForm = ({
  username,
  password,
  confirmPassword,
  rol,
  onChange,
}: CredentialFormProps) => (
  <>
    <label htmlFor="username">Usuario:</label>
    <input
      type="text"
      id="username"
      value={username}
      onChange={(e) => onChange("username", e.target.value)}
      className="input-field"
    />

    <label htmlFor="password">Contraseña:</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => onChange("password", e.target.value)}
      className="input-field"
    />

    <label htmlFor="confirmPassword">Confirmar contraseña:</label>
    <input
      type="password"
      id="confirmPassword"
      value={confirmPassword}
      onChange={(e) => onChange("confirmPassword", e.target.value)}
      className="input-field"
    />

    <label htmlFor="rol">Rol:</label>
    <select
      id="rol"
      value={rol}
      onChange={(e) => onChange("rol", e.target.value)}
      className="input-field"
    >
      <option value="">Selecciona un rol</option>
      <option value="1">Empleado</option>
      <option value="2">Administrador</option>
      <option value="3">Supervisor</option>
      <option value="4">Analista de datos</option>
    </select>

  </>
);

export const Signup = () => {
  const [step, setStep] = useState(1);
  const [credenciales, setCredenciales] = useState<Credenciales>({
    username: "",
    password: "",
    confirmPassword: "",
    rol: ""
  });

  const [datos, setDatos] = useState<DatosEmpleado>({
    nombre: "",
    apellido: "",
    tipo_identificacion: "DNI",
    numero_identificacion: "",
    correo_electronico: "",
    pais_nacimiento: "",
    calle: "",
    numero_calle: "",
    localidad: "",
    partido: "",
    provincia: "",
    fecha_nacimiento: "",
    telefono: "",
    genero: "",
    estado_civil: ""
  });


  const [errorResponse, setErrorResponse] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // const [partidos, setPartidos] = useState<Partido[]>([]);
  const [partidosOptions, setPartidosOptions] = useState<{ label: string; value: string }[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [provinciaOptions, setProvinciaOptions] = useState<{ label: string; value: string }[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidadOptions, setLocalidadOptions] = useState<{ label: string; value: string }[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [paisOptions, setPaisOptions] = useState<{ label: string; value: string }[]>([]);



  useEffect(() => {
    const fetchLocalidadesPorProvincia = async () => {
      if (!datos.provincia) {
        setLocalidadOptions([]);
        return;
      }

      const provinciaSeleccionada = provincias.find(
        (prov) => prov.nombre === datos.provincia
      );

      if (!provinciaSeleccionada) return;

      try {
        const response = await fetch(
          `https://render-crud-jc22.onrender.com/api/localidades-filtrado/?codigo_provincia=${provinciaSeleccionada.codigo_provincia}`
        );
        const data = await response.json();
        setLocalidades(data);
        console.log(localidades);

        const options = data.map((loc: Localidad) => ({
          label: loc.nombre,
          value: loc.nombre,
        }));

        setLocalidadOptions(options);
      } catch (error) {
        console.error("Error al obtener localidades:", error);
        setLocalidadOptions([]);
      }
    };

    fetchLocalidadesPorProvincia();
  }, [datos.provincia, provincias]);


  useEffect(() => {
    const fetchPartidosPorProvincia = async () => {
      if (!datos.provincia) {
        setPartidosOptions([]);
        return;
      }

      const provinciaSeleccionada = provincias.find(
        (prov) => prov.nombre === datos.provincia
      );

      if (!provinciaSeleccionada) return;

      try {
        const response = await fetch(
          `https://render-crud-jc22.onrender.com/api/partidos-filtrado/?codigo_provincia=${provinciaSeleccionada.codigo_provincia}`
        );
        const data = await response.json();

        const options = data.map((p: Partido) => ({
          label: p.nombre,
          value: p.nombre,
        }));

        setPartidosOptions(options);
      } catch (error) {
        console.error("Error al obtener partidos por provincia:", error);
        setPartidosOptions([]);
      }
    };

    const fetchProvincias = async () => {
      try {
        const response = await fetch('https://render-crud-jc22.onrender.com/api/provincias');
        const data = await response.json();
        setProvincias(data);

        const options = data.map((p: Provincia) => ({
          label: p.nombre,
          value: p.nombre,
        }));

        setProvinciaOptions(options);
      } catch (error) {
        console.error("Error al obtener provincias:", error);
      }
    };

    
    fetchProvincias();
    fetchPartidosPorProvincia();
    
  }, [datos.provincia, provincias]);
  
  const fetchPaises = useCallback(async () => {
try {
  const response = await fetch('https://render-crud-jc22.onrender.com/api/paises');
  const data = await response.json();
  setPaises(data);
  console.log("Paises recibidos:", data);
  const options = data.map((pais: Pais) => ({
    label: pais.nombre,
    value: pais.nombre,
  }));
  setPaisOptions(options);
} catch (error) {
  console.error("Error al obtener países:", error);
}
}, []);
  useEffect(() => {
  fetchPaises();
}, [fetchPaises]);

  const navigate = useNavigate();

  const handleCredencialesChange = (campo: keyof Credenciales, valor: string) => {
    setCredenciales((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleDatosChange = (campo: keyof DatosEmpleado, valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const isFormValid =
    Object.values(datos).every((val) => val !== "") &&
    Object.values(credenciales).every((val) => val !== "") &&
    credenciales.password === credenciales.confirmPassword;

  function formatearCampo(campo: string): string {
    const mapa: Record<string, string> = {
      nombre: "nombre",
      apellido: "apellido",
      tipo_identificacion: "tipo de identificación",
      numero_identificacion: "número de identificación",
      correo_electronico: "correo electrónico",
      pais_nacimiento: "país de nacimiento",
      calle: "calle",
      numero_calle: "número de calle",
      localidad: "localidad",
      partido: "partido",
      provincia: "provincia",
      fecha_nacimiento: "fecha de nacimiento",
      telefono: "teléfono",
      genero: "género",
      estado_civil: "estado civil",
      username: "nombre de usuario",
      password: "contraseña",
      confirmPassword: "confirmación de contraseña",
      rol: "rol",
    };

    return mapa[campo] || campo;
  }


  function validarCampos(): string | null {
    // Validaciones de datos personales
    for (const [key, value] of Object.entries(datos)) {
      if (!value || value.trim() === "") {
        return `El campo '${formatearCampo(key)}' es obligatorio.`;
      }
    }

    if (!/\S+@\S+\.\S+/.test(datos.correo_electronico)) return "El correo electrónico no tiene un formato válido.";
    if (datos.numero_identificacion.length < 6) return "El número de identificación debe tener al menos 6 dígitos.";
    if (datos.telefono.length < 6) return "El teléfono debe tener al menos 6 caracteres.";
    if (new Date(datos.fecha_nacimiento) > new Date()) return "La fecha de nacimiento no puede ser futura.";

    // Validaciones de credenciales
    for (const [key, value] of Object.entries(credenciales)) {
      if (!value || value.trim() === "") {
        return `El campo '${formatearCampo(key)}' es obligatorio.`;
      }
    }

    if (credenciales.password.length < 4) return "La contraseña debe tener al menos 4 caracteres.";
    if (credenciales.password !== credenciales.confirmPassword) return "Las contraseñas no coinciden.";
    if (!credenciales.rol) return "Debes seleccionar un rol.";

    return null;
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorResponse("");
    setSuccessMessage("");

    const errorValidacion = validarCampos();
    if (errorValidacion) {
      setErrorResponse(errorValidacion);
      return;
    }


    try {
      // Crear empleado primero
      const empleadoCreado = await crearEmpleado2(datos);
      console.log("Empleado creado:", empleadoCreado);

      const codigoVerificacion = empleadoCreado.codigo;
      const id_empleado = empleadoCreado?.id_empleado.id_empleado;
      console.log("ID del empleado creado:", id_empleado);

      if (!id_empleado) {
        setErrorResponse("No se pudo obtener el ID del empleado creado.");
        return;
      }

      // Crear usuario luego
      const usuarioCreado = await crearUsuario(
        id_empleado,
        credenciales.rol, // ID de rol por defecto
        credenciales.username,
        credenciales.password,
        "Registro manual"
      );

      if (usuarioCreado) {
        setSuccessMessage("Registro exitoso");
        console.log("Usuario creado:", usuarioCreado);

        navigate("/registro-facial", {
          state: { id_empleado, codigoVerificacion },
        });


        // Opcional: limpiar formulario o redirigir
      } else {
        setErrorResponse("No se pudo crear el usuario.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorResponse(
        "Ocurrió un error en la conexión o en el proceso de registro."
      );
    }
  };


  const progresoActual = Math.round(
    ((Object.values(datos).filter((v) => v !== "").length +
      Object.values(credenciales).filter((v) => v !== "").length) /
      (Object.keys(datos).length + Object.keys(credenciales).length)) *
    100
  );

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="logo-container">
          <img
            src="./logo_producto.png"
            alt="ShainFlow Logo"
            className="logo"
          />
        </div>

        {!!errorResponse && (
          <div className="error-message">{errorResponse}</div>
        )}
        {!!successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              style={{ width: "100%", minWidth: "250px" }}
            >
              <div className="input-columns">
                <div className="column">
                  <label htmlFor="nombre">Nombres:</label>
                  <input
                    id="nombre"
                    value={datos.nombre}
                    onChange={(e) =>
                      handleDatosChange("nombre", e.target.value)
                    }
                    className="input-field"
                  />

                  <label htmlFor="apellido">Apellido:</label>
                  <input
                    id="apellido"
                    value={datos.apellido}
                    onChange={(e) =>
                      handleDatosChange("apellido", e.target.value)
                    }
                    className="input-field"
                  />

                  <label htmlFor="correo_electronico">Email:</label>
                  <input
                    id="correo_electronico"
                    type="email"
                    value={datos.correo_electronico}
                    onChange={(e) =>
                      handleDatosChange("correo_electronico", e.target.value)
                    }
                    className="input-field"
                  />

                  <label htmlFor="tipo_identificacion">
                    Tipo de Documento:
                  </label>
                  <select
                    id="tipo_identificacion"
                    value={datos.tipo_identificacion}
                    onChange={(e) =>
                      handleDatosChange("tipo_identificacion", e.target.value)
                    }
                    className="input-field"
                  >
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Cédula">Cédula</option>
                  </select>

                  <label htmlFor="numero_identificacion">
                    {datos.tipo_identificacion}
                  </label>
                  <input
                    id="numero_identificacion"
                    type="number"
                    value={datos.numero_identificacion}
                    onChange={(e) =>
                      handleDatosChange("numero_identificacion", e.target.value)
                    }
                    className="input-field"
                  />
                  <label htmlFor="fecha_nacimiento">Fecha de nacimiento:</label>
                  <input
                    id="fecha_nacimiento"
                    type="date"
                    value={datos.fecha_nacimiento}
                    onChange={(e) =>
                      handleDatosChange("fecha_nacimiento", e.target.value)
                    }
                    className="input-field"
                  />

                  <label htmlFor="telefono">Teléfono:</label>
                  <input
                    id="telefono"
                    type="tel"
                    value={datos.telefono}
                    onChange={(e) =>
                      handleDatosChange("telefono", e.target.value)
                    }
                    className="input-field"
                  />
                </div>

                <div className="column">
                  <label htmlFor="pais_nacimiento">País de nacimiento:</label>
                  <Select
                    id="pais_nacimiento"
                    options={paisOptions}
                    value={paisOptions.find((option) => option.value === datos.pais_nacimiento)}
                    onChange={(opcion) =>
                      handleDatosChange("pais_nacimiento", opcion ? opcion.value : "")
                    }
                    className="input-field react-select"
                    placeholder="Selecciona un país..."
                    isClearable
                  />
                  <label htmlFor="provincia">Provincia:</label>
                  <Select
                    id="provincia"
                    options={provinciaOptions}
                    value={provinciaOptions.find((option) => option.value === datos.provincia)}
                    onChange={(opcion) => {
                      handleDatosChange("provincia", opcion ? opcion.value : "");
                      handleDatosChange("partido", ""); // Limpiar partido seleccionado
                      handleDatosChange("localidad", ""); // Limpiar localidad también
                    }}
                    className="input-field react-select"
                    placeholder="Selecciona una provincia..."
                    isClearable
                  />


                  <label htmlFor="partido">Partido:</label>
                  <Select
                    id="partido"
                    options={partidosOptions}
                    value={partidosOptions.find((option) => option.value === datos.partido)}
                    onChange={(opcion) =>
                      handleDatosChange("partido", opcion ? opcion.value : "")
                    }
                    className="input-field react-select"
                    placeholder="Selecciona un partido..."
                    isClearable
                  />
                  <label htmlFor="localidad">Localidad:</label>
                  <Select
                    id="localidad"
                    options={localidadOptions}
                    value={localidadOptions.find((option) => option.value === datos.localidad)}
                    onChange={(opcion) =>
                      handleDatosChange("localidad", opcion ? opcion.value : "")
                    }
                    className="input-field react-select"
                    placeholder="Selecciona una localidad..."
                    isClearable
                  />



                  <div className="cont-direccion">
                    <label htmlFor="calle">Calle:</label>
                    <input
                      id="calle"
                      value={datos.calle}
                      onChange={(e) =>
                        handleDatosChange("calle", e.target.value)
                      }
                      className="input-field"
                    />

                    <label htmlFor="numero_calle">N°:</label>
                    <input
                      id="numero_calle"
                      type="number"
                      value={datos.numero_calle}
                      onChange={(e) =>
                        handleDatosChange("numero_calle", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>

                  <label htmlFor="genero">Género:</label>
                  <select
                    id="genero"
                    value={datos.genero}
                    onChange={(e) =>
                      handleDatosChange("genero", e.target.value)
                    }
                    className="input-field"
                  >
                    <option value="">Selecciona un género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="No binario">No binario</option>
                    <option value="Prefiere no especificar">Prefiere no especificar</option>
                    <option value="Otro">Otro</option>
                  </select>

                  <label htmlFor="estado_civil">Estado civil:</label>
                  <select
                    id="estado_civil"
                    value={datos.estado_civil}
                    onChange={(e) =>
                      handleDatosChange("estado_civil", e.target.value)
                    }
                    className="input-field"
                  >
                    <option value="">Selecciona tu estado civil</option>
                    <option value="Soltero/a">Soltero/a</option>
                    <option value="Casado/a">Casado/a</option>
                    <option value="Divorciado/a">Divorciado/a</option>
                    <option value="Viudo/a">Viudo/a</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="input-columns">
                <div className="column">
                  <CredentialForm
                    {...credenciales}
                    onChange={handleCredencialesChange}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="progress"
          role="progressbar"
          aria-valuenow={progresoActual}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-bar"
            style={{
              width: `${progresoActual}%`,
              backgroundColor: "var(--c1)",
            }}
          >
            {progresoActual}%
          </div>
        </div>

        {step === 1 ? (
          <button
            type="button"
            className="signup-button"
            onClick={() => setStep(2)}
            disabled={
              !datos.nombre ||
              !datos.apellido ||
              !datos.correo_electronico ||
              !datos.tipo_identificacion ||
              !datos.numero_identificacion ||
              !datos.pais_nacimiento ||
              !datos.calle ||
              !datos.numero_calle ||
              !datos.fecha_nacimiento ||
              !datos.telefono ||
              !datos.genero ||
              !datos.estado_civil
            }
          >
            Siguiente
          </button>
        ) : (
          <div className="button-row">
            <button
              type="button"
              className="signup-button secondary"
              onClick={() => setStep(1)}
            >
              Volver
            </button>
            <button
              type="submit"
              className="signup-button"
              disabled={!isFormValid}
            >
              Registrarse
            </button>
          </div>
        )}

        <div className="face-login-section">
          <p className="login-text">
            ¿Estás registrado?
            <br />
            <NavLink to="/login">Ingresar manualmente</NavLink>
          </p>
          <NavLink to="/">
            <img
              src="/scaneo.png"
              alt="Reconocimiento facial"
              title="Reconocimiento facial"
              className="face-icon"
            />
          </NavLink>
        </div>
      </form>
    </DefaultLayout>
  );
};
