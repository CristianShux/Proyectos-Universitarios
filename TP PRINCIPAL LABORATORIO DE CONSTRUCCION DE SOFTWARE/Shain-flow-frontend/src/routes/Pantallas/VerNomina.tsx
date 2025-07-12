import '../../estilos/VerNomina.css'
const recibo = {
  empresa: "Shain Flow",
  periodo: "Enero 2025",
  empleado: {
    nombre: "Abel Aquino",
    numero_empleado: "1",
  },
  ingresos: [
    { tipo: "Salario Base", monto: 10000 },
    { tipo: "Horas Extras", monto: 2000 },
  ],
  deducciones: [
    { tipo: "IESS", monto: 500 },
    { tipo: "Impuestos", monto: 1000 },
  ],
  total_ingresos: '1.200.000',
  total_deducciones: '150.000',
  total_neto: '1.050.000',
};

function CabeceraRecibo() {
  return (
    <header>
      <h1>{recibo.empresa}</h1>
      <p>Periodo: {recibo.periodo}</p>
    </header>
  );
}

// function ListaItems() {
//   return (
//     <section>
//       <h2>Ingresos</h2>
//       <ul>
//         <li>
//             "Salario base" : "600.000"
//         </li>
//         <li>
//             "Horas extras" : "70.000"
//         </li>
//         {/*items.map((item, index) => (
//           <li key={index}>
//             {item.tipo}: {item.monto}
//           </li>
//         ))*/}
//       </ul>
//       <h2>Descuentos</h2>
//         <ul>
//             <li>
//                 "Descuento Obra Social" : "60.000"
//             </li>
//         </ul>
//     </section>
//   );
// }

export function VerNomina() {
  return (
    <div>
      <div className="ver-nomina-container">
      <div className="ver-nomina-wrapper">
        <section className="nomina-section">
          <CabeceraRecibo />
        </section>

        <section className="nomina-section">
          <h2>Datos del Empleado</h2>
          <p>Nombre: {recibo.empleado.nombre}</p>
          <p>Número de Empleado: {recibo.empleado.numero_empleado}</p>
        </section>

        <section className="nomina-section tabla-wrapper">
          <table className="tabla-nomina">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Decripción</th>
                <th>Ingreso</th>
                <th>Descuento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>Salario base</td>
                <td>600.000</td>
                <td>62.000</td>
              </tr>
              <tr>
                <td>02</td>
                <td>Antigüedad</td>
                <td>170.000</td>
                <td>24.000</td>
              </tr>
              <tr>
                <td>03</td>
                <td>Presentismo</td>
                <td>40.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Horas extras</td>
                <td>45.000</td>
              </tr>
              <tr>
                <td>05</td>
                <td>Descuento Obra Social</td>
                <td></td>
                <td>60.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Descuento ANSSAL</td>
                <td></td>
                <td>20.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Descuento Ley 19.032</td>
                <td></td>
                <td>5.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Impuesto a las Ganancias</td>
                <td></td>
                <td>5.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Descuento Sindical</td>
                <td></td>
                <td>10.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Descuento Jubilatorio</td>
                <td></td>
                <td>12.000</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="nomina-section">
          <h2>Totales</h2>
          <p>Total Ingresos: {recibo.total_ingresos}</p>
          <p>Total Deducciones: {recibo.total_deducciones}</p>
          <p>Total Neto: {recibo.total_neto}</p>
        </section>
      </div>
    </div>
    </div>
  );}
  /*return (
    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', border: '1px solid black', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)', width: '70%' }}>
        <section style={{ border: '1px solid black', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', marginTop: '20px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
          <CabeceraRecibo />
        </section>
        <section style={{ border: '1px solid black', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', marginTop: '20px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
          <h2>Datos del Empleado</h2>
          <p>Nombre: {recibo.empleado.nombre}</p>
          <p>Número de Empleado: {recibo.empleado.numero_empleado}</p>
        </section>
        <section style={{ border: '1px solid black', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', marginTop: '20px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px', overflowX: 'auto'}}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '300px' }}>
            <thead>
              <tr>
                <th>Concepto</th>
                <th >Decripción</th>
                <th>Ingreso</th>
                <th>Descuento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>Salario base</td>
                <td>600.000</td>
                <td>62.000</td>
              </tr>
              <tr>
                <td>02</td>
                <td>Antigüedad</td>
                <td>170.000</td>
                <td>24.000</td>
              </tr>
              <tr>
                <td>03</td>
                <td>Presentismo</td>
                <td>40.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Horas extras</td>
                <td>45.000</td>
              </tr>
              <tr>
                <td>05</td>
                <td>Descuento Obra Social</td>
                <td></td>
                <td>60.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Descuento ANSSAL</td>
                <td></td>
                <td>20.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Descuento Ley 19.032</td>
                <td></td>
                <td>5.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Impuesto a las Ganancias</td>
                <td></td>
                <td>5.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Descuento Sindical</td>
                <td></td>
                <td>10.000</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Descuento Jubilatorio</td>
                <td></td>
                <td>12.000</td>
              </tr>
            </tbody>
          </table>
          {/*<ListaItems  />*/
        /*</section>
        <section style={{ border: '1px solid black', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', marginTop: '20px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
          <h2>Totales</h2>
          <p>Total Ingresos: {recibo.total_ingresos}</p>
          <p>Total Deducciones: {recibo.total_deducciones}</p>
          <p>Total Neto: {recibo.total_neto}</p>
        </section>
      </div>
    </div>
  )
}*/