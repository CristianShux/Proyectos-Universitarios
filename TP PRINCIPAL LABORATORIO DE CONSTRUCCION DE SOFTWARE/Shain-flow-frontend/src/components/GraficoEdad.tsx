import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  {
    nombre: 'Edad',
    edad_18_25: 30,
    edad_26_35: 40,
    edad_36_45: 20,
    edad_56_65: 10,
  },
];

const GraficoEdad: React.FC = () => {
  return (
    <div className="funnel-container" >
      <div style={{ flex: 1 }}>
        <h2 >Informe de edad</h2>
        <p >Contextualiza tu tema</p>

        <ResponsiveContainer width="100%" height={80}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="nombre" hide />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Bar dataKey="edad_18_25" stackId="a" fill="#ff8080" name="18-25" />
            <Bar dataKey="edad_26_35" stackId="a" fill="#ffb347" name="26-35" />
            <Bar dataKey="edad_36_45" stackId="a" fill="#7ea7c9" name="36-45" />
            <Bar dataKey="edad_56_65" stackId="a" fill="#003f5c" name="56-65" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='funnel-label' >
        <h4>EDAD MEDIA</h4>
        <h2>29,5</h2>
        <p>años</p>
      </div>
    </div>
  );
};

export default GraficoEdad;