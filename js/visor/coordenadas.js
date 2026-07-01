// ==============================
// MODO COORDENADAS (DEBUG)
// ==============================
// Permite capturar:
// - Puntos (etiquetas)
// - Cuadrantes (zonas)
// Copia automáticamente el HTML generado

const MODO_COORDENADAS = true; // activar/desactivar herramienta

export function iniciarCoordenadas(visor, estado){

    // Si está desactivado → no hace nada
    if(!MODO_COORDENADAS) return;

    console.log("🧭 MODO COORDENADAS ACTIVADO");

    let puntosCapturados = []; // Guarda clicks temporales
    let previewRect = null;    // Rectángulo de vista previa
    let modo = "etiqueta";     // "etiqueta" o "cuadrante"

    // ============================
    // UI: BOTONES PARA ELEGIR EL MODO 
    // ============================

    function crearUI(){

        const contenedor = document.createElement("div");

        // Posición flotante
        contenedor.style.position = "fixed";
        contenedor.style.top = "60px";
        contenedor.style.left = "50%";
        contenedor.style.transform = "translateX(-50%)";
        contenedor.style.zIndex = "99999";
        contenedor.style.display = "flex";
        contenedor.style.gap = "10px";

        const btnEtiqueta = document.createElement("button");
        btnEtiqueta.textContent = "🏷️ Etiqueta";

        const btnCuadrante = document.createElement("button");
        btnCuadrante.textContent = "⬛ Cuadrante";

        // Estilos básicos
        [btnEtiqueta, btnCuadrante].forEach(btn => {
            btn.style.padding = "6px 12px";
            btn.style.border = "none";
            btn.style.borderRadius = "6px";
            btn.style.cursor = "pointer";
        });

        // Actualiza estado visual del botón activo
        function actualizarUI(){
            btnEtiqueta.style.background = modo === "etiqueta" ? "#0d6efd" : "#ccc";
            btnEtiqueta.style.color = modo === "etiqueta" ? "#fff" : "#000";

            btnCuadrante.style.background = modo === "cuadrante" ? "#0d6efd" : "#ccc";
            btnCuadrante.style.color = modo === "cuadrante" ? "#fff" : "#000";
        }

        // Cambiar a modo etiqueta
        btnEtiqueta.onclick = () => {
            modo = "etiqueta";
            puntosCapturados = [];
            limpiarPreview();
            actualizarUI();
            mostrarToast("✏️ Modo etiqueta");
        };

        // Cambiar a modo cuadrante
        btnCuadrante.onclick = () => {
            modo = "cuadrante";
            puntosCapturados = [];
            limpiarPreview();
            actualizarUI();
            mostrarToast("🧩 Modo cuadrante");
        };

        contenedor.appendChild(btnEtiqueta);
        contenedor.appendChild(btnCuadrante);
        document.body.appendChild(contenedor);

        actualizarUI();
    }

    // ============================
    // TOAST (mensaje flotante)
    // ============================

    function mostrarToast(mensaje){

        let toast = document.getElementById("toast-coordenadas");

        if(!toast){
            toast = document.createElement("div");
            toast.id = "toast-coordenadas";

            // Estilos
            toast.style.position = "fixed";
            toast.style.top = "20px";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.background = "rgba(0,0,0,0.85)";
            toast.style.color = "#fff";
            toast.style.padding = "10px 18px";
            toast.style.borderRadius = "8px";
            toast.style.zIndex = "99999";
            toast.style.opacity = "0";
            toast.style.transition = "opacity 0.3s ease";

            document.body.appendChild(toast);
        }

        toast.textContent = mensaje;
        toast.style.opacity = "1";

        setTimeout(() => toast.style.opacity = "0", 1200);
    }

    // ============================
    // COPIAR AL PORTAPAPELES
    // ============================

    function copiar(texto){
        navigator.clipboard.writeText(texto);
    }

    // ============================
    // MARCAR PUNTO VISUAL
    // ============================

    function crearPunto(x, y){

        const punto = document.createElement("div");

        punto.style.width = "10px";
        punto.style.height = "10px";
        punto.style.background = "red";
        punto.style.borderRadius = "50%";
        punto.style.transform = "translate(-50%, -50%)";

        visor.addOverlay({
            element: punto,
            location: new OpenSeadragon.Point(x, y)
        });
    }

    // ============================
    // PREVIEW DE CUADRANTE
    // ============================

    function limpiarPreview(){
        if(previewRect){
            try{ visor.removeOverlay(previewRect); }catch(e){}
            previewRect.remove();
            previewRect = null;
        }
    }

    function crearPreview(x, y, w, h){

        limpiarPreview();

        const div = document.createElement("div");

        div.style.border = "3px solid red";
        div.style.background = "rgba(255,0,0,0.25)";

        visor.addOverlay({
            element: div,
            location: new OpenSeadragon.Rect(x, y, w, h)
        });

        previewRect = div;
    }

    // ============================
    // MOUSE MOVE (solo cuadrante)
    // ============================

    new OpenSeadragon.MouseTracker({
        element: visor.canvas,

        moveHandler: function(event){

            if(modo !== "cuadrante") return;
            if(puntosCapturados.length !== 1) return;

            const vp = visor.viewport.pointFromPixel(event.position);

            let x = puntosCapturados[0].x;
            let y = puntosCapturados[0].y;
            let w = vp.x - x;
            let h = vp.y - y;

            // Ajuste si se arrastra en sentido inverso
            if(w < 0){ x = vp.x; w = Math.abs(w); }
            if(h < 0){ y = vp.y; h = Math.abs(h); }

            crearPreview(x, y, w, h);
        }
    });

    // ============================
    // CLICK EN VISOR
    // ============================

    visor.addHandler("canvas-click", event => {

        if(!event.quick) return;

        const vp = visor.viewport.pointFromPixel(event.position);

        const x = +vp.x.toFixed(4);
        const y = +vp.y.toFixed(4);

        //  MODO ETIQUETA (1 click)
        if(modo === "etiqueta"){

            crearPunto(x, y);

            const texto = `<div class="etiqueta-link"
data-level="${estado.currentLevel}"
data-id="${estado.currentId}"
data-x="${x}"
data-y="${y}"
data-label="TEXTO_ETIQUETA">
</div>`;

            copiar(texto);
            mostrarToast("📍 Etiqueta copiada");
            return;
        }

        // MODO CUADRANTE (2 clicks)
        puntosCapturados.push({x, y});
        crearPunto(x, y);

        if(puntosCapturados.length === 2){

            const [p1, p2] = puntosCapturados;

            const w = (p2.x - p1.x).toFixed(4);
            const h = (p2.y - p1.y).toFixed(4);

            const texto = `<div data-parent="${estado.currentLevel}"
data-parent-id="${estado.currentId}"
data-target="ID_DESTINO"
data-target-level="X"
data-label=""
data-x="${p1.x}"
data-y="${p1.y}"
data-w="${w}"
data-h="${h}">
</div>`;

            copiar(texto);
            mostrarToast("🧩 Cuadrante copiado");

            limpiarPreview();
            puntosCapturados = [];
        }

    });

    // ============================
    // INICIO
    // ============================

    crearUI();
}