import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
    {mes: "Enero",  semana_1: 10, semana_2: 20, semana_3: 36, semana_4: 33 },
    {mes: 'Febrero',semana_1: 25, semana_2: 22, semana_3: 34, semana_4: 37 },
    {mes: 'Marzo',  semana_1: 15, semana_2: 21, semana_3: 28, semana_4: 23 },
    {mes: 'Abril',  semana_1: 20, semana_2: 17, semana_3: 27, semana_4: 43 },
    {mes: 'Mayo',   semana_1: 12, semana_2: 18, semana_3: 14, semana_4: 13 },
    {mes: 'Junio',  semana_1: 20, semana_2: 24, semana_3: 35, semana_4: 36 },
    {mes: 'Julio',  semana_1: 15, semana_2: 12, semana_3: 41, semana_4: 34 },
]

export const GraficoDeBarra = () => {
  return (
    <div className="chart-container" style={{ display: 'flex', justifyContent: 'center'}}>
      <ResponsiveContainer width="60%" aspect={2}>        
        <BarChart
          data={data}          
          width={300}
          height={150}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="4 1 2" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="semana_1" fill="#6b48ff" label={{position:"top"}}/>
          <Bar dataKey="semana_2" fill="#1ee3cf" label={{position:"top"}}/>
          <Bar dataKey="semana_3" fill="#fd7e14" label={{position:"top"}}/>
          <Bar dataKey="semana_4" fill="#d63384" label={{position:"top"}}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}