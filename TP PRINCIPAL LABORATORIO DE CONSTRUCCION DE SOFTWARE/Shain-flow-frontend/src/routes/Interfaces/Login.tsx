import { useEffect, useState } from "react";
import DefaultLayout from "../../components/DefaultLayout";
import '../../estilos/login.css'
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { iniciarSesion } from "../../services/api";
import { useUser } from "../../context/UserContext";
import { CircularProgress } from "@mui/material";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para mostrar errores
  const [cargando, setCargando] = useState(false);
  const { usuario, setUsuario } = useUser();
  const navegar = useNavigate();

  useEffect(() => {
    if (usuario) {
      console.log(usuario.id_empleado);
      console.log(usuario.rol);
      console.log(usuario.numero_identificacion);    
    }
  }, [usuario]);

  function handleChange(e: React.ChangeEvent) {
    const { name, value } = e.target as HTMLInputElement;
    if (name === "username") {
      setUsername(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (username.length == 0 && password.length == 0) {
    setError("El usuario y la contraseña no pueden estar vacíos.")
    return;
  } 
  // Validaciones básicas
  if (username.trim().length === 0 && password.length > 0) {
    setError("El nombre de usuario no puede estar vacío.");
    return;
  }

  if (password.length < 4 && username.trim().length > 0) {
    setError("La contraseña debe tener al menos 4 caracteres.");
    return;
  }

  try {
    setCargando(true);
    const resultado = await iniciarSesion(username, password);
    setCargando(false);

    if (resultado.access_token) {
      sessionStorage.setItem("token", resultado.access_token);
      sessionStorage.setItem(
        "usuario",
        JSON.stringify({
          permisos: resultado.permisos,
          rol: resultado.rol,
          id_empleado: resultado.id_empleado,
          numero_identificacion: resultado.numero_identificacion,
        })
      );

      setUsuario(resultado);
      setError("");

      switch (resultado.rol) {
        case "1":
          navegar(`/empleado`);
          break;
        case "2":
          navegar(`/administrador`);
          break;
        case "3":
          navegar(`/supervisor`);
          break;
        case "4":
          navegar(`/analista-datos`);
          break;
        default:
          setError("Rol no reconocido");
      }
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    setError("Ocurrió un error al intentar iniciar sesión.");
  }
}

  return (
    <DefaultLayout>
      <div className="cont_login_empresa" style={{ position: "relative" }}>
         {cargando && (
          <div className="overlay">
            <CircularProgress />
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form">
        {/* Logo */}
        <div className="logo-container">
          <img
            src="./logo_producto.png"
            alt="ShainFlow Logo"
            className="logo"
          />
        </div>

        {/* Mensaje de error */}
        {error && <div className="error-message">{error}</div>}

        {/* Usuario */}
        <div className="cont-input">
          <label htmlFor="username">Usuario:</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={handleChange}
            value={username}
            className="input-field"
          />
        </div>

        {/* Contraseña */}
        <div className="cont-input">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            value={password}
            className="input-field"
          />
        </div>

        {/* Botón */}
        <button type="submit" className="login-button">
          Login
        </button>

        {/* Ícono de reconocimiento facial */}
        <div className="face-id-container">
          <NavLink to="/">
            <img
              src="/scaneo.png"
              alt="Reconocimiento facial"
              className="face-id-icon"
            />
          </NavLink>
        </div>

        {/* Enlace de registro */}
        <p className="register-text">
          ¿No puedes ingresar o no tienes una cuenta?{" "}
          <NavLink to="/signup">Regístrate</NavLink>
        </p>
      </form>
      </div>
    </DefaultLayout>
  );
};
