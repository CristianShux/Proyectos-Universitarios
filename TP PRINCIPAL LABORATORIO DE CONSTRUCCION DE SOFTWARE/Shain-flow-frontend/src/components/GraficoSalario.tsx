import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { rango: '<2m', dep1: 2, dep2: 1, dep3: 3, dep4: 5 },
  { rango: '2-3m', dep1: 4, dep2: 2, dep3: 1, dep4: 2 },
  { rango: '3.5-5m', dep1: 3, dep2: 5, dep3: 1, dep4: 2 },
  { rango: '>7m', dep1: 2, dep2: 1, dep3: 0, dep4: 3 },
  { rango: 'Sin salario', dep1: 0, dep2: 0, dep3: 0, dep4: 2 },
];

export const GraficoSalarios: React.FC = () => {
  return (
    <div className="funnel-container" >        
        <div className="funnel-chart-wrapper">
        <h2 >Informe de salarios</h2>
        <p>Por departamentos</p>
        <ResponsiveContainer width="100%" height="90%" >
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rango" />
            <YAxis label={{ value: 'Personas', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend verticalAlign="bottom" />
            <Bar dataKey="dep1" stackId="a" fill="#ff8080" name="Dep. 1" />
            <Bar dataKey="dep2" stackId="a" fill="#ffb347" name="Dep. 2" />
            <Bar dataKey="dep3" stackId="a" fill="#cce5ff" name="Dep. 3" />
            <Bar dataKey="dep4" stackId="a" fill="#003f5c" name="Dep. 4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='funnel-label' >
        <h4>SALARIO PROMEDIO</h4>
        <h2>2m</h2>
        <p >pesos</p>
      </div>
    </div>
    
  );
};