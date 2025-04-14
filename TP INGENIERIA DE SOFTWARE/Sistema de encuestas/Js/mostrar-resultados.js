document.addEventListener('DOMContentLoaded', function () {
    const formElements = document.querySelectorAll('input[type="number"], textarea');
    const resultadosLista = document.getElementById('listaResultados');

    // Cargar los datos del Local Storage y mostrarlos
    formElements.forEach(element => {
        const savedValue = localStorage.getItem(element.id);
        if (savedValue) {
            const listItem = document.createElement('li');
            listItem.textContent = `${element.name}: ${savedValue}`;
            resultadosLista.appendChild(listItem);
        }
    });

    // Limpiar los datos de Local Storage después de mostrarlos
    localStorage.clear();
});