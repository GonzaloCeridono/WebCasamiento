document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const lightbox = document.getElementById('lightbox');
    const imagenAmpliada = document.getElementById('imagen-ampliada');
    const cerrarBtn = document.querySelector('.cerrar');
    const anteriorBtn = document.querySelector('.anterior');
    const siguienteBtn = document.querySelector('.siguiente');
    const contador = document.querySelector('.contador');
    const imagenesGaleria = document.querySelectorAll('.grid-fotos img');
    const imagenesCierre = document.querySelectorAll('.grid-fotosCierre img');
    
    // Combinamos ambas colecciones de imágenes
    const todasImagenes = [...imagenesGaleria, ...imagenesCierre];
    const totalImagenes = todasImagenes.length;
    let indiceActual = 0;

    // Función para actualizar el lightbox
    function actualizarLightbox(index) {
        indiceActual = index;
        imagenAmpliada.src = todasImagenes[indiceActual].src;
        contador.textContent = `${indiceActual + 1} / ${totalImagenes}`;
    }

    // Abrir lightbox
    function abrirLightbox(index, event) {
        if (event) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }
        actualizarLightbox(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Cerrar lightbox
    function cerrarLightbox(event) {
        if (event) event.stopImmediatePropagation();
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Cambiar imagen
    function cambiarImagen(direccion, event) {
        if (event) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }
        
        let nuevoIndice = indiceActual + direccion;
        if (nuevoIndice < 0) nuevoIndice = totalImagenes - 1;
        if (nuevoIndice >= totalImagenes) nuevoIndice = 0;
        
        actualizarLightbox(nuevoIndice);
        return false;
    }

    // Asignación de eventos para las imágenes de cierre
    imagenesCierre.forEach((img, index) => {
        // Calculamos el índice global (imágenes de galería + cierre)
        const indiceGlobal = imagenesGaleria.length + index;
        img.addEventListener('click', (e) => abrirLightbox(indiceGlobal, e));
    });

    // Eventos existentes para la galería principal
    imagenesGaleria.forEach((img, index) => {
        img.addEventListener('click', (e) => abrirLightbox(index, e));
    });

    // Eventos de navegación
    anteriorBtn.addEventListener('click', function(e) {
        e.stopImmediatePropagation();
        cambiarImagen(-1, e);
    }, true);

    siguienteBtn.addEventListener('click', function(e) {
        e.stopImmediatePropagation();
        cambiarImagen(1, e);
    }, true);

    // Evento para cerrar
    cerrarBtn.addEventListener('click', cerrarLightbox, true);
    lightbox.addEventListener('click', cerrarLightbox);
    imagenAmpliada.addEventListener('click', function(e) {
        e.stopImmediatePropagation();
    });

    // Teclado
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') cerrarLightbox();
            if (e.key === 'ArrowLeft') cambiarImagen(-1);
            if (e.key === 'ArrowRight') cambiarImagen(1);
        }
    });

    // Exportar funciones para HTML
    window.abrirLightbox = abrirLightbox;
    window.cerrarLightbox = cerrarLightbox;
    window.cambiarImagen = function(d) { return cambiarImagen(d, window.event); };
});