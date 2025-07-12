import React, { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./estilos/empleado-item.css";
import { useUser } from "../context/UserContext";
import {
  FaEdit,
  FaBriefcase,
  FaClock,
  FaTimesCircle,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartBar,
  FaCalendar,
} from 'react-icons/fa';
import ModalEmailForm from "./ModalFormEmail";

type Item = {
  id_empleado: number;
  numero_identificacion: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  imagen_perfil_url?: string;
};

type Props = {
  items: Item[];
  itemsPerPage?: number;
};

const Paginacion: React.FC<Props> = ({ items, itemsPerPage = 5 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState<string>("1");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");

  const { usuario } = useUser();

  // Filtra los elementos según el término de búsqueda
  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.numero_identificacion
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // Sincronizar el input con la página actual cuando esta cambie
  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  //  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //    setSearchTerm(e.target.value);
  //    setCurrentPage(1);
  //  };

  // Actualiza el input mientras el usuario escribe
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Permitir solo dígitos vacíos o numéricos
    if (/^\d*$/.test(val)) {
      setInputPage(val);
    }
  };

  // Cuando el usuario termina de editar (blur o Enter), validar y navegar
  const commitInputPage = () => {
    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      // Si no es válido, resetear el input a la página actual
      setInputPage(String(currentPage));
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitInputPage();
    }
  };

  const handleInputBlur = () => {
    commitInputPage();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página en nueva búsqueda
  };

  return (
    <div>
      <div className="busqueda-container">
        <input
          className="busqueda-input"
          type="text"
          placeholder="Buscar empleado por nombre, apellido o ID..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <span className="icono-busqueda">🔍</span>
      </div>
      <ul className="empleado-items">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div className="empleado-item" key={item.id_empleado}>
              <div className="icono-header">
                <span className="icono-perfil">
                  {item.imagen_perfil_url ? (
                    <img src={item.imagen_perfil_url} alt="" width="50px" />
                  ) : (
                    <span className="icono-perfil">👤</span>
                  )}
                </span>

                {/* Mostrar íconos solo si el usuario es administrador */}
                {usuario?.rol === "2" && (
                  <div className="acciones-iconos">
                    {/* <NavLink
                      to={`/administrador/enviar-email/${item.id_empleado}`}
                      className="emoji-correo"
                      title="Enviar email"
                    >
                      📧
                    </NavLink> */}
                    <button
                      className="emoji-correo"
                      title="Enviar email"
                      onClick={() => {
                        setModalAbierto(true);
                        setEmailDestino(item.correo);
                      }}
                    >
                      📧
                    </button>
                    <NavLink
                      to={`/administrador/asistencias/${item.id_empleado}`}
                      className="emoji-calendario"
                      title="Ver asistencias"
                    >
                      📅
                    </NavLink>
                  </div>
                )}
              </div>
              <span className="empleado-nombre">
                {item.nombre} {item.apellido}
              </span>
              <div className="empledo-botones">
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol === "3" && (
                    <NavLink
                      className="link"
                      to={`/supervisor/asistencias/${item.id_empleado}`}
                    >
                      <FaCalendar className="icono" title="Ver asistencias" />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "3" && (
                    <NavLink
                      className={"link"}
                      to={`/supervisor/reportes/${item.id_empleado}`}
                    >
                      <FaChartBar className="icono" title="Ver reportes" />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "3" && (
                    <NavLink className={"link"} to="/supervisor/ver-nomina">
                      <FaMoneyBillWave className="icono" title="Ver nomina" />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "4" && (
                    <NavLink
                      className={"link"}
                      to={`/analista-datos/reportes/${item.id_empleado}`}
                    >
                      <FaChartBar className="icono" title="Ver reportes" />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "4" && (
                    <NavLink className={"link"} to="/analista-datos/ver-nomina">
                      <FaMoneyBillWave className="icono" title="Ver nomina" />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "2" && ( // verifica si el usuario tiene permiso para editar datos personales de los empleados
                    <NavLink
                      className={"link"}
                      to="/administrador/empleados/editarEmpleado"
                      state={item}
                    >
                      <FaEdit className="icono" title="Editar" />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "2" && (
                    <NavLink
                      className={"link"}
                      to={`/administrador/empleados/${item.id_empleado}/agregar-datos-laborales`}
                    >
                      <FaBriefcase
                        className="icono"
                        title="Agregar datos laborales"
                      />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "2" && (
                    <NavLink
                      className="link"
                      to={`/administrador/empleados/${item.id_empleado}/agregar-jornada`}
                    >
                      <FaClock className="icono" title="Agregar jornada" />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "2" && (
                    <NavLink
                      className="link"
                      to={`/administrador/empleados/${item.id_empleado}/inasistencia`}
                    >
                      <FaTimesCircle
                        className="icono"
                        title="Agregar inasistencia"
                      />
                    </NavLink>
                  )}
                {usuario?.permisos.editar_datos_personales &&
                  usuario.rol == "2" && (
                    <NavLink
                      className="link"
                      to={`/administrador/empleados/${item.id_empleado}/asistenciaUnica`}
                    >
                      <FaCalendarCheck
                        className="icono"
                        title="Agregar asistencia única"
                      />
                    </NavLink>
                  )}
              </div>
            </div>
          ))
        ) : (
          <li>No se encontraron resultados.</li>
        )}
        <ModalEmailForm
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          destinatario={emailDestino}
        />
      </ul>

      <div className="nav-paginas" style={{ marginTop: "1rem" }}>
        <button
          className="btn-ant-pag"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <span>Página</span>

        <input
          className="pagina-input"
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />

        <span>de {totalPages}</span>

        <button
          className="btn-sig-pag"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paginacion;
