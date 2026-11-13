document.addEventListener("DOMContentLoaded", async function () {

    // ==========================================
    // RUTAS GENERALES DEL PROYECTO
    // ==========================================

    const script = document.querySelector('script[src*="plantilla.js"]');

    if (!script) return;

    const baseURL = new URL("../", script.src);

    const headerURL = new URL("plantillas/header.html", baseURL);
    const footerURL = new URL("plantillas/footer.html", baseURL);

    const homeURL = new URL("pages/home/home.html", baseURL).href;
    const logoURL = new URL("pages/home/images/logo-uni.png", baseURL).href;

    // CARGAR HEADER

    try {
        const response = await fetch(headerURL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.text();

        const headerContainer = document.getElementById("header-container");

        if (headerContainer) {
            headerContainer.innerHTML = data;
        } else {
            document.body.insertAdjacentHTML("afterbegin", data);
        }

        // Configurar enlaces al inicio
        document.querySelectorAll(".home-link").forEach(enlace => {
            enlace.href = homeURL;
        });

        // Configurar imagen del logo
        const logo = document.querySelector(".navbar-brand");

        if (logo) {
            logo.src = logoURL;
        }

    } catch (error) {
        console.error("Error cargando header:", error);
    }

    // CARGAR FOOTER

    try {
        const response = await fetch(footerURL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.text();

        const footerContainer = document.getElementById("footer-container");

        if (footerContainer) {
            footerContainer.innerHTML = data;
        } else {
            document.body.insertAdjacentHTML("beforeend", data);
        }

    } catch (error) {
        console.error("Error cargando footer:", error);
    }

});
