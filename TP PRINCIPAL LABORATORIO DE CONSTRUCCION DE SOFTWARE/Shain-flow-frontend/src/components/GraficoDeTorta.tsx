import { PieChart, ResponsiveContainer, Pie, Tooltip, Cell, Legend } from 'recharts'

const data = [
    { name: "Asistencia", value: 94 },
    { name: 'Inacistencia', value: 8 },
    { name: "Tardanzas", value: 4 },
    { name: 'Salida anticipada', value: 16 },
]

const COLORS = ['#20c997', '#dc3545', '#fd7e14', '#ffc107', '#f48fb1', '#d500f9']

export const GraficoDeTorta = () => {

  return (
    <div className="chart-container" style={{ width: '100%', height: 300,}}>
        <ResponsiveContainer>
            <PieChart>
                <Pie
                    startAngle={180}
                    endAngle={0}
                    dataKey="value" 
                    data={data}
                    innerRadius={100}
                    outerRadius={150}
                    fill="#82ca9d"
                >
                   {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}     
                </Pie>
                <Tooltip />
                  <Legend
                      verticalAlign="middle"
                      wrapperStyle={{ paddingTop: "4%" }}
                      payload={
                          data.map(
                              (item, index) => ({
                                  id: item.name,
                                  type: "square",
                                  value: `${item.name} :${item.value}`,
                                  color: COLORS[index % COLORS.length]
                              })
                          )
                      }
                  />
            </PieChart>

        </ResponsiveContainer>
    </div>
  )
}