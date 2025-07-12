import React, { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import "./estilos/empleado-item.css";

type Item = {
  id_empleado: number;
  numero_identificacion: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
};

type Props = {
  items: Item[];
  itemsPerPage?: number;
};

const SearchablePaginatedList: React.FC<Props> = ({
  items,
  itemsPerPage = 5,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página en nueva búsqueda
  };

  return (
    <div>
      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar empleado por nombre, apellido o ID..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: "1rem", padding: "4px" }}
        />
        <span className="icono-busqueda">🔍</span>
      </div>

      <ul className="empleado-items">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div className="empleado-item" key={item.id_empleado}>
              <span className="icono-perfil">
                <img
                  src="https://imgs.search.brave.com/z1pY-zOd_QZunrzoobVmAzPXl4KV3X43yVSRA6IYek4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lcy52/aXNhZm90by5jb20v/aW1nLzR4NC1jbS1w/YXNzcG9ydC1waG90/by1leGFtcGxlLndl/YnA"
                  alt=""
                  width="50px"
                />
              </span>
              <span className="empleado-nombre">
                {item.nombre} {item.apellido}
              </span>
              <NavLink
                className={"link"}
                to="/supervisor/empleadosSup"
              ></NavLink>
              <NavLink
                className="link"
                to={`/supervisor/asistencias/${item.id_empleado}`}
              >
                Ver asistencias
              </NavLink>
              <NavLink
                className={"link"}
                to={`/supervisor/reportes/${item.id_empleado}`} // Cambia esta línea
              >
                Ver Reportes
              </NavLink>
              <NavLink className={"link"} to="/supervisor/ver-nomina">
                Ver nomina
              </NavLink>
            </div>
          ))
        ) : (
          <li>No se encontraron resultados.</li>
        )}
      </ul>

      <div className="nav-paginas" style={{ marginTop: "1rem" }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            className="btn-nros"
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? "bold" : "normal",
              margin: "0 4px",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default SearchablePaginatedList;
