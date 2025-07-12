import React from "react";
import './estilos/default-layout.css'

interface DefaultLayoutProps {
  children?: React.ReactNode;
}
export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="default-layout">
      <div className="cont-empresa">
        <div className="empresa-logo">
          <img src="/Logo_Empresa.png" alt="Logo de la empresa" />
        </div>
        <div className="empresa-descripcion">
          <p>
          “Soluciones de RRHH con visión de futuro”  
          </p>
<p>"Mirai" (未来): futuro en japonés.</p> 
<p>"Solutions": soluciones concretas. </p>
<p>SHAIN FLOW “Flujo de empleados” </p>
<p>"Shain" (社員): empleado o miembro de una organización.</p>
<p>"Flow": flujo, automatizado y moderno.</p> 

        </div>
        <div className="empresa-integrantes">
          <h3>Nuestro equipo</h3>
          <ul>
            <li>Cristian Jurajuria – Scrum Master / DBA</li>
            <li>Lautaro Moreno – Desarrollador Frontend</li>
            <li>Pablo Da Silva - Desarrollador Frontend</li>
            <li>Abel Aquino - Desarrollador Backend</li>
            <li>Rodrigo Montoro – Desarrollador Backend / Analista Funcional</li>
            <li>Mauro Palavecino – Desarrollador Backend / QA Tester</li>
          </ul>
        </div>
      </div>
      <div className="cont-child">
        {children}
      </div>
    </div>
  );
}
