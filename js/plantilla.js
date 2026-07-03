// ==============================
// CARGAR HEADER Y FOOTER DINÁMICAMENTE
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // Cargar HEADER
    fetch("../../../../plantillas/header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
        })
        .catch(error => console.error("Error cargando header:", error));

    // Cargar FOOTER
    fetch("../../../../plantillas/footer.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
        })
        .catch(error => console.error("Error cargando footer:", error));

});
