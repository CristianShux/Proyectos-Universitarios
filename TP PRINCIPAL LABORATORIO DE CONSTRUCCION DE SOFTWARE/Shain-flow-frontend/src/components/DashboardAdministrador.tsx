import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import "./estilos/DashboardAdministrador.css";

type DashboardItem = {
  title: string;
  url: string;
};

const dashboards: Record<string, DashboardItem[]> = {
  Administrador: [
    {
      title: "Resumen empresarial",
      url: "https://3-137-176-177.sslip.io/public/dashboard/034fa285-4541-46b9-928a-2fa75d33a171",
    },
  ],
  Supervisor: [
    {
      title: "Resumen mensual jornadas",
      url: "https://3-137-176-177.sslip.io/public/dashboard/6d0497a8-4e46-43e2-9dbd-6cb75f8ecf79",
    },
    {
      title: "Comparativo mensual asistencias",
      url: "https://3-137-176-177.sslip.io/public/dashboard/7fd2a19d-0f0c-4fc7-be40-195ec14b9726",
    },
  ],
  Analista: [
    {
      title: "Resumen analíticos",
      url: "https://3-137-176-177.sslip.io/public/dashboard/bfba3005-23d3-4abd-bdb8-a8cc239a225c",
    },
    {
      title: "Análisis de sueldos",
      url: "https://3-137-176-177.sslip.io/public/dashboard/81b40216-45f6-4858-9e8b-c31814ff6a1c",
    },
  ],
};

export const DashboardA: React.FC = () => {
  const secciones = Object.keys(dashboards);
  const [seccionActiva, setSeccionActiva] = useState(secciones[0]);
  const [tabIndex, setTabIndex] = useState(0);
  const [cargando, setCargando] = useState(true);

  const dashboardsActivos = dashboards[seccionActiva];

  return (
    <div className="dashboard-container">
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
        <FormControl size="small">
          <InputLabel>Sección</InputLabel>
          <Select
            value={seccionActiva}
            onChange={(e) => {
              setSeccionActiva(e.target.value);
              setTabIndex(0);
              setCargando(true);
            }}
            label="Sección"
          >
            {secciones.map((seccion) => (
              <MenuItem key={seccion} value={seccion}>
                {seccion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h6" sx={{ mt: 1 }}>
          Dashboards de {seccionActiva}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Tabs
        value={tabIndex}
        onChange={(_, newIndex) => {
          setTabIndex(newIndex);
          setCargando(true);
        }}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Tabs de dashboards"
        sx={{ mb: 2 }}
      >
        {dashboardsActivos.map((dashboard, index) => (
          <Tab key={index} label={dashboard.title} />
        ))}
      </Tabs>

      {cargando && (
        <div className="loading-overlay">
          <CircularProgress style={{ color: "#fff" }} />
        </div>
      )}

      <iframe
        src={dashboardsActivos[tabIndex].url}
        title={dashboardsActivos[tabIndex].title}
        frameBorder="0"
        width="100%"
        height="100%"
        allowTransparency={true}
        onLoad={() => setCargando(false)}
        className="dashboard-iframe"
      />
    </div>
  );
};