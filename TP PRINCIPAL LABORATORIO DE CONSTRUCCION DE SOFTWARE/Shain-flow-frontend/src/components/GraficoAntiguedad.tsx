import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import '../estilos/graficos.css'

const data = [
  { antiguedad: 'hasta 6 meses', porcentaje: 43 },
  { antiguedad: '0.5 a 5 años', porcentaje: 35 },
  { antiguedad: '5 a 10 años', porcentaje: 10 },
  { antiguedad: '10 a 20 años', porcentaje: 7 },
  { antiguedad: 'mas de 20 años', porcentaje: 5 },
];

const GraficoAntiguedad: React.FC = () => {
  return (
    <div className="funnel-container">
      
      <div className="funnel-chart-wrapper">
        <h2 className='funnel-titulo'>Informe de antigüedad laboral</h2>
        <p className='funnel-header'>Porcentaje por rango de años laborales</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="antiguedad" width={100} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="porcentaje" fill="#c82333" barSize={24}>
              <LabelList
                dataKey="porcentaje"
                position="right"
                formatter={(val: number) => `${val}%`}
                style={{ fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoAntiguedad;
