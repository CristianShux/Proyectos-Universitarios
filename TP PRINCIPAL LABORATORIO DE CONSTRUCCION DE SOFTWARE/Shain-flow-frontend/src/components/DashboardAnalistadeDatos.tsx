import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./estilos/DashboardAnalista.css";
export const DashboardAn: React.FC = () => {
  const dashboards = [
    {
      title: "Resumen analiticos",
      url: "https://3-137-176-177.sslip.io/public/dashboard/bfba3005-23d3-4abd-bdb8-a8cc239a225c",
    },
    {
      title: "Analisis de sueldos",
      url: "https://3-137-176-177.sslip.io/public/dashboard/81b40216-45f6-4858-9e8b-c31814ff6a1c",
    },
  ];

  const [index, setIndex] = useState(0);
  const [cargando, setCargando] = useState(true);

  const handleChangeIndex = (newIndex: number) => {
    setIndex(newIndex);
    setCargando(true);
  };

  return (
    <div className="dashboard-an-container">
      <h2>{dashboards[index].title}</h2>

      <div className="dashboard-an-buttons">
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
        <div className="dashboard-an-loader">
          <CircularProgress style={{ color: "#fff" }} />
        </div>
      )}

      <iframe
        key={dashboards[index].url}
        src={dashboards[index].url}
        className="dashboard-an-iframe"
        title="Dashboard"
        onLoad={() => setCargando(false)}
      />
    </div>
  );
};