import { NavBar } from "../../components/NavBar";
import { Outlet } from "react-router-dom";

const navItemsAnalista = [
  { label: "Datos personales", icon: "fa-solid fa-address-card", path: "verDatos" },
  // { label: "Confirmación", icon: "fa-solid fa-square-check", path: "confirmacion" },
  { label: "Datos laborales", icon: "fa-solid fa-user-tie", path: "datosLaborales" },
  { label: "Asistencias", icon: "fa-regular fa-id-card", path: "asistencias" },
  { label: "Empleados", icon: "fa-solid fa-users", path: "empleados" },
  // { label: "Reportería", icon: "fa-solid fa-chart-simple", path: "reportes-analista" },
  // { label: "Nóminas", icon: "fa-solid fa-coins", path: "#" },
  { label: "Dashboard", icon: "fa-solid fa-chart-bar", path: "dashboard" },
  { label: "Cerrar sesión", icon: "fa-solid fa-lock", path: "/login" },
];

/*
Interfaz Analista de Datos:
Configura y analiza modelos (si los tiene), como un científico de datos.
Puede ver los datos de los empleados, el registro de asistencias y la nómina; no podrá realizar modificaciones.
Puede hacer reportes y gráficos con la información que ve. Esto podría ser útil para el supervisor, RRHH, etc.
*/

export const AnalistaDeDatos = () => {
  return (
    <>
      <NavBar items={navItemsAnalista} logoSrc="/logo_producto.png" />
      <main>
        <Outlet /> {/* Aquí se renderiza la ruta hija */}
      </main>
    </>
  );
};