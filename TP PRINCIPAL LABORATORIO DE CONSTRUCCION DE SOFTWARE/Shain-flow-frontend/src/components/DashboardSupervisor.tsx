import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./estilos/DashboardSupervisor.css"; // 

export const DashboardS: React.FC = () => {
  const dashboards = [
    {
      title: "Resumen mensual jornadas",
      url: "https://3-137-176-177.sslip.io/public/dashboard/6d0497a8-4e46-43e2-9dbd-6cb75f8ecf79",
    },
    {
      title: "Comparativo mensual asistencias",
      url: "https://3-137-176-177.sslip.io/public/dashboard/7fd2a19d-0f0c-4fc7-be40-195ec14b9726",
    },
  ];

  const [index, setIndex] = useState(0);
  const [cargando, setCargando] = useState(true);

  const handleChangeIndex = (newIndex: number) => {
    setIndex(newIndex);
    setCargando(true);
  };

  return (
    <div className="dashboard-s-container">
      <h2>{dashboards[index].title}</h2>

      <div className="dashboard-s-buttons">
        <button
          onClick={() => handleChangeIndex(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          ⬅️ Anterior
        </button>
        <button
          onClick={() =>
            handleChangeIndex(Math.min(dashboards.length - 1, index + 1))
          }
          disabled={index === dashboards.length - 1}
          style={{ marginLeft: "10px" }}
        >
          Siguiente ➡️
        </button>
      </div>

      {cargando && (
        <div className="dashboard-s-loader">
          <CircularProgress style={{ color: "#fff" }} />
        </div>
      )}

      <iframe
        key={dashboards[index].url}
        src={dashboards[index].url}
        className="dashboard-s-iframe"
        title="Dashboard"
        onLoad={() => setCargando(false)}
      />
    </div>
  );
};