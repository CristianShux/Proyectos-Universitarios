import { NavBar } from "../../components/NavBar";
import { Outlet } from "react-router-dom";

const navItemsEmpleado = [
  { label: "Datos personales", icon: "fa-solid fa-user", path: "verDatos" },
  // { label: "Confirmación", icon: "fa-solid fa-square-check", path: "confirmacion" },
  { label: "Datos laborales", icon: "fa-solid fa-user-tie", path: "datosLaborales" },
  { label: "Asistencias", icon: "fa-regular fa-id-card", path: "asistencias" },
  { label: "Información Bancaria", icon: "fa-solid fa-money-bill", path: "info-bancaria" },
  { label: "Cerrar sesión", icon: "fa-solid fa-lock", path: "/login" },
];

/*
Interfaz Empleado:
Puede ver, editar y realizar acciones sobre sus datos personales, su información laboral, su registro de asistencias y faltas, sus últimos recibos de sueldo y sus horas extra.
*/

export const Empleado = () => {
  return (
    <>
      <NavBar items={navItemsEmpleado} logoSrc="/logo_producto.png"  />
      <main>
        <Outlet /> {/* Aquí se renderiza la ruta hija */}
      </main>
    </>
  );
};
