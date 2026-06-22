    // Permite mover el panel del formulario arrastrándolo desde su encabezado
    (function () {
        function inicializarArrastre() {
            const panel = document.getElementById('panelControl');
            const agarradera = panel ? panel.querySelector('.panel-header') : null;
            if (!panel || !agarradera) return;

            let arrastrando = false;
            let desplazamientoX = 0;
            let desplazamientoY = 0;

            // La primera vez que se arrastra, fijamos el panel con left/top en px
            // y quitamos el centrado por transform.
            function fijarPosicionInicialSiHaceFalta() {
                if (panel.dataset.posicionFijada === 'true') return;
                const rect = panel.getBoundingClientRect();
                panel.style.left = rect.left + 'px';
                panel.style.top = rect.top + 'px';
                panel.style.transform = 'none';
                panel.dataset.posicionFijada = 'true';
            }

            function limitarDentroDeLaPantalla(x, y) {
                const ancho = panel.offsetWidth;
                const alto = panel.offsetHeight;
                const maxX = window.innerWidth - ancho;
                const maxY = window.innerHeight - alto;
                return {
                    x: Math.min(Math.max(x, 0), Math.max(maxX, 0)),
                    y: Math.min(Math.max(y, 0), Math.max(maxY, 0))
                };
            }

            function alPresionar(evento) {
                // Evitar que arrastrar empiece si se hace clic en el botón de cerrar
                if (evento.target.closest('#botonCerrarPanel')) return;

                fijarPosicionInicialSiHaceFalta();

                const esTactil = evento.type === 'touchstart';
                const puntoX = esTactil ? evento.touches[0].clientX : evento.clientX;
                const puntoY = esTactil ? evento.touches[0].clientY : evento.clientY;

                const rect = panel.getBoundingClientRect();
                desplazamientoX = puntoX - rect.left;
                desplazamientoY = puntoY - rect.top;
                arrastrando = true;
                agarradera.style.cursor = 'grabbing';

                document.addEventListener('mousemove', alMover);
                document.addEventListener('mouseup', alSoltar);
                document.addEventListener('touchmove', alMover, { passive: false });
                document.addEventListener('touchend', alSoltar);
            }

            function alMover(evento) {
                if (!arrastrando) return;
                if (evento.type === 'touchmove') evento.preventDefault();

                const esTactil = evento.type === 'touchmove';
                const puntoX = esTactil ? evento.touches[0].clientX : evento.clientX;
                const puntoY = esTactil ? evento.touches[0].clientY : evento.clientY;

                const nuevaX = puntoX - desplazamientoX;
                const nuevaY = puntoY - desplazamientoY;
                const limitado = limitarDentroDeLaPantalla(nuevaX, nuevaY);

                panel.style.left = limitado.x + 'px';
                panel.style.top = limitado.y + 'px';
            }

            function alSoltar() {
                arrastrando = false;
                agarradera.style.cursor = 'grab';
                document.removeEventListener('mousemove', alMover);
                document.removeEventListener('mouseup', alSoltar);
                document.removeEventListener('touchmove', alMover);
                document.removeEventListener('touchend', alSoltar);
            }

            agarradera.style.cursor = 'grab';
            agarradera.addEventListener('mousedown', alPresionar);
            agarradera.addEventListener('touchstart', alPresionar, { passive: true });

            // Si la ventana cambia de tamaño, evitamos que el panel quede fuera de pantalla
            window.addEventListener('resize', function () {
                if (panel.dataset.posicionFijada !== 'true') return;
                const rect = panel.getBoundingClientRect();
                const limitado = limitarDentroDeLaPantalla(rect.left, rect.top);
                panel.style.left = limitado.x + 'px';
                panel.style.top = limitado.y + 'px';
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', inicializarArrastre);
        } else {
            inicializarArrastre();
        }
    })();