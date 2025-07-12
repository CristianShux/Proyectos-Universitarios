import { NavBar } from "../../components/NavBar";
import { Outlet } from "react-router-dom";

const navItemsSupervisor = [
  { label: "Datos personales", icon: "fa-solid fa-address-card", path: "verDatos" },
  // { label: "Confirmación", icon: "fa-solid fa-square-check", path: "confirmacion" },
  { label: "Datos laborales", icon: "fa-solid fa-user-tie", path: "datosLaborales" },
  { label: "Asistencias", icon: "fa-regular fa-id-card", path: "asistencias" },
  { label: "Empleados", icon: "fa-regular fa-id-card", path: "empleados" },
  /*{ label: "Reprtes", icon: "fa-regular fa-id-card", path: "reportes" },*/
  { label: "Dashboard", icon: "fa-solid fa-chart-bar", path: "dashboard" },  // <-- nuevo ítem
  { label: "Cerrar sesión", icon: "fa-solid fa-lock", path: "/login" },
];

export const Supervisor = () => {
  return (
    <>
      <NavBar items={navItemsSupervisor} logoSrc="/logo_producto.png" />
      <main>
        <Outlet /> {/* Aquí se renderiza la ruta hija */}
      </main>
    </>
  );
};
