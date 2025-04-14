document.addEventListener('DOMContentLoaded', function () {
    const formElements = document.querySelectorAll('input[type="number"], textarea');

    // Guardar datos en Local Storage y mostrar en pantalla al cambiar cualquier entrada
    formElements.forEach(element => {
        element.addEventListener('input', () => {
            localStorage.setItem(element.id, element.value);
        });
    });

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        
        let resultadosHTML = '<h2>Datos ingresados:</h2><ul>';
        
        formElements.forEach(element => {
            resultadosHTML += `<li>${element.name}: ${element.value}</li>`;
        });

        resultadosHTML += '</ul>';

        const ventanaResultados = window.open("", "_blank", "width=600, height=400");
        ventanaResultados.document.write("<html><head><title>Resultados Encuesta</title></head><body>");
        ventanaResultados.document.write(resultadosHTML);
        ventanaResultados.document.write("</body></html>");
    });
});


document.addEventListener("DOMContentLoaded", mainFunction);

function mainFunction() {
    let boton_recordatorios = document.getElementById("enviar_recordatorios");

    let boton_reportes = document.getElementById("generar_reporte");

    boton_recordatorios.addEventListener("click", function () {
        enviarRecordatorios()
    })

    boton_reportes.addEventListener("click", function () {
        generarReporte()
    })

};

function enviarRecordatorios() {
    let mensaje = document.getElementById("mensaje_mails");
    mensaje.textContent = "Se enviaron recordatorios a los siguientes mails:"   // poner cantidad final?

    let lista = document.getElementById("lista_mails");
    lista.innerHTML = ""; //limpia la lista 

    usuarios.forEach(usuario => {
        if (usuario.encuesta == "incompleta") {
            let mail_usuario = document.createElement("li");
            mail_usuario.textContent = usuario.mail;
            lista.appendChild(mail_usuario);
        }
    });
};

function generarReporte() {
    let mensaje = document.getElementById("mensaje_reporte");
    mensaje.textContent = "Usuarios que completaron las encuestas:"

    let lista = document.getElementById("lista_reporte");
    lista.innerHTML = "";

    usuarios.forEach(usuario => {
        if (usuario.encuesta == "completa") {
            let nombre_usuario = document.createElement("li");
            nombre_usuario.textContent = usuario.nombre;
            lista.appendChild(nombre_usuario);
        }
    });
};


let usuarios = [{
    "nombre": "Emiliano Martinez",
    "mail": "dibumartinez@gmail.com",
    "encuesta": "incompleta"
},
{
    "nombre": "Nahuel Molina",
    "mail": "nahumolina@gmail.com",
    "encuesta": "completa"
},
{
    "nombre": "Cristian Romero",
    "mail": "cutiromero@gmail.com",
    "encuesta": "completa"
},
{
    "nombre": "Nicolas Otamendi",
    "mail": "nicootamendi@gmail.com",
    "encuesta": "incompleta"
},
{
    "nombre": "Nicolas Tagliafico",
    "mail": "nicotaglia@gmail.com",
    "encuesta": "completa"
},
{
    "nombre": "Rodrigo De Paul",
    "mail": "rodridepaul@gmail.com",
    "encuesta": "incompleta"
},
{
    "nombre": "Enzo Fernandez",
    "mail": "enzofernandez@gmail.com",
    "encuesta": "incompleta"

},
{
    "nombre": "Alexis Mac Allister",
    "mail": "alemaca@gmail.com",
    "encuesta": "completa"
},
{
    "nombre": "Lionel Messi",
    "mail": "lapulgamessi@gmail.com",
    "encuesta": "incompleta"
},
{
    "nombre": "Julian Alvarez",
    "mail": "spiderman@gmail.com",
    "encuesta": "incompleta"
},
{
    "nombre": "Angel Di Maria",
    "mail": "fideodimaria@gmail.com",
    "encuesta": "completa"
}];


let centros = [{
    "nombre": "Hospital Larcade",
    "direccion": "Peron 2311, San Miguel",
    //coordenadas?
    "horarios": "Lunes a Viernes de 7 a 23 hs, Sábados de 8 a 13 hs",
}

];