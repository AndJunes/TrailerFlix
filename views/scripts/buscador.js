document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const contenedorResultados = document.getElementById('contenedor-resultados');
    const heroContent = document.querySelector('.hero-content');

    // Función para manejar la búsqueda
    const handleSearch = async () => {
        const query = searchInput.value.trim();
        
        if (!query) {
            mostrarError('Por favor ingresa un término de búsqueda');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3008/titulo/${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                throw new Error(`No se encontraron resultados para "${query}"`);
            }
            
            mostrarResultados(data.results);
        } catch (error) {
            console.error('Error:', error);
            mostrarError(error.message);
        }
    };

    // Event listeners para el botón y la tecla Enter
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    function mostrarResultados(data) {
        // Ocultar contenido hero si existe
        if (heroContent) heroContent.remove();
        
        // Limpiar contenedor
        contenedorResultados.innerHTML = '';
        
        // Crear contenedor de resultados
        const container = document.createElement('div');
        container.className = 'container-fluid py-4';
        container.innerHTML = `
            <h2 class="text-white mb-4 text-center">Resultados de búsqueda</h2>
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4" id="resultados-row"></div>
        `;
        
        const row = container.querySelector('#resultados-row');
        
        // Generar cartas para cada resultado
        data.forEach(item => {
            const cartaHTML = `
            <div class="col-md-2 conteiner">
                <div class="card serie">
                    <div class="card-header">
                        <img 
                        src="${item.poster}" 
                        alt="Poster de ${item.titulo}" 
                        class="poster cursor-pointer"
                        data-id="${item.id}"
                        style="width: 150px; height: 225px; object-fit: cover;">
                    </div>           
                </div>
            </div>
            `;
            row.insertAdjacentHTML('beforeend', cartaHTML);
        });

        // Event listeners para los posters
        row.querySelectorAll('.poster').forEach(poster => {
            poster.addEventListener('click', () => {
                const itemId = poster.dataset.id;
                const itemSeleccionado = data.find(c => c.id == itemId);
                abrirModal(itemSeleccionado);
            });
        });
        
        contenedorResultados.appendChild(container);
    }

    function mostrarError(mensaje) {
        contenedorResultados.innerHTML = `
            <div class="alert alert-danger mt-4">
                ${mensaje}
            </div>
        `;
    }

    // Reutilizamos las funciones de modal del código original
    function abrirModal(item) {
        // Crear modal si no existe
        let modal = document.getElementById('modal-catalogo');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-catalogo';
            modal.className = 'modal-series';
            modal.innerHTML = `
                <div class="modal-contenido">
                    <span class="modal-cerrar">&times;</span>
                    <h2 class="text-white">${item.titulo}</h2>
                    <div class="modal-cuerpo">
                        <div class="trailer-container">
                            <iframe width="100%" height="400" src="${item.trailer}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div class="info-container text-white mt-3">
                            ${item.genero ? `<p><strong>Género:</strong> ${item.genero}</p>` : ''}
                            ${item.tipo ? `<p><strong>Tipo:</strong> ${item.tipo}</p>` : ''}
                            ${item.temporadas ? `<p><strong>Temporadas:</strong> ${item.temporadas}</p>` : ''}
                            ${item.reparto ? `<p><strong>Reparto:</strong> ${item.reparto}</p>` : ''}
                            ${item.resumen ? `<p class="mt-2"><strong>Sinopsis:</strong> ${item.resumen}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Event listeners para cerrar modal
            modal.querySelector('.modal-cerrar').addEventListener('click', cerrarModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) cerrarModal();
            });
        }

        // Actualizar contenido del modal
        modal.querySelector('h2').textContent = item.titulo;
        modal.querySelector('iframe').src = item.trailer;
        modal.querySelector('.info-container').innerHTML = `
            ${item.genero ? `<p><strong>Género:</strong> ${item.genero}</p>` : ''}
            ${item.tipo ? `<p><strong>Tipo:</strong> ${item.tipo}</p>` : ''}
            ${item.temporadas ? `<p><strong>Temporadas:</strong> ${item.temporadas}</p>` : ''}
            ${item.reparto ? `<p><strong>Reparto:</strong> ${item.reparto}</p>` : ''}
            ${item.resumen ? `<p class="mt-2"><strong>Sinopsis:</strong> ${item.resumen}</p>` : ''}
        `;

        // Mostrar modal
        modal.style.display = 'block';
    }

    function cerrarModal() {
        const modal = document.getElementById('modal-catalogo');
        if (modal) {
            modal.style.display = 'none';
            // Detener el video
            const iframe = modal.querySelector('iframe');
            iframe.src = iframe.src; // Reinicia el iframe
        }
    }

    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });
});