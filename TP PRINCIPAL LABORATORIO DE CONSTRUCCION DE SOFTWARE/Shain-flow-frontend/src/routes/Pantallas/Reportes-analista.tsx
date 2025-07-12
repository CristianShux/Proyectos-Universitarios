import { exportChartsToPDF } from "../../components/ExportaAPDF";
import GraficoAntiguedad from "../../components/GraficoAntiguedad";
import GraficoEdad from "../../components/GraficoEdad";
import { GraficoSalarios } from "../../components/GraficoSalario";

export function ReportesAnalista() {
    return (
        <div  style={{ alignContent:'center'}}>
            <div className="chart-container">
                <GraficoSalarios />
                <GraficoEdad />
                <GraficoAntiguedad />
            </div>
            
            <div>
                <button onClick={exportChartsToPDF}>Exportar a PDF</button>
            </div>            
        </div>
        
        
    )
}