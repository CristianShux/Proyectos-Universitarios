import { useParams } from "react-router-dom";
import { useState } from "react";
import "../../estilos/Reportes.css"

export function Reportes() {
    const { id_empleado } = useParams<{ id_empleado?: string }>();
    const [iframeLoaded, setIframeLoaded] = useState(false);
    
    // Configuración del dashboard
const metabaseUrl = `https://3-137-176-177.sslip.io/embed/dashboard/6d7f9cc7-30db-4711-855c-46c19eccc377?id_empleado=${id_empleado}#theme=transparent&hide_parameters=id_empleado`;



    if (!id_empleado) {
        return (
            <div className="no-employee">
                <h2 >
                    No se ha seleccionado ningún empleado
                </h2>
                <p >
                    Seleccione un empleado desde la lista para ver sus reportes
                </p>
            </div>
        );
    }

    return (
        <div className="reportes-container" >
            <h1 >
                Reporte del empleado #{id_empleado}
            </h1>

            <div className="iframe-wrapper" >
                {!iframeLoaded && (
                    <div className="loader-overlay">
                        <div className="spinner"></div>
                        <p >Cargando reportes...</p>
                    </div>
                )}

                <iframe className={`cont-ifr${iframeLoaded ? ' loaded' : ''}`}
                    src={metabaseUrl}
                    title={`Reportes del empleado ${id_empleado}`}
                    onLoad={() => setIframeLoaded(true)}
                />
            </div>
        </div>
    );
}