document.addEventListener('DOMContentLoaded', () => {
    const categoriaLink = document.getElementById('peliculas-link');
    const contenedorCatalogo = document.getElementById('contenedor-catalogo');
    const heroContent = document.querySelector('.hero-content');

    categoriaLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3008/categoria/pelicula');
            
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                throw new Error('No se encontraron películas');
            }
            
            generarCartas(data.results);
        } catch (error) {
            console.error('Error:', error);
            contenedorCatalogo.innerHTML = `
                <div class="alert alert-danger mt-4">
                    ${error.message}
                </div>
            `;
        }
    });

    function generarCartas(data) {
        heroContent.remove();
        contenedorCatalogo.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'container-fluid py-4';
        container.innerHTML = `
            <h2 class="text-white mb-4 text-center">Catálogo de Películas</h2>
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4" id="catalogo-row"></div>
        `;
        
        const row = container.querySelector('#catalogo-row');
        
        data.forEach(carta => {
            const añoHTML = carta.año ? `<p class="card-text">Año: ${carta.año}</p>` : '';
            const generoHTML = carta.genero ? `<p class="card-text">Género: ${carta.genero}</p>` : '';
            
            const cartaHTML = `
            <div class="col-md-2 conteiner">
                <div class="card serie">
                    <div class="card-header">
                        <img 
                        src="${carta.poster}" 
                        alt="Poster de ${carta.titulo}" 
                        class="poster cursor-pointer"
                        data-id="${carta.id}"
                        style="width: 150px; height: 225px; object-fit: cover;">
                    </div>           
                </div>
            </div>
            `;
            row.insertAdjacentHTML('beforeend', cartaHTML);
        });

        // Event listeners para los posters (nuevo)
        row.querySelectorAll('.poster').forEach(poster => {
            poster.addEventListener('click', () => {
                const cartaId = poster.dataset.id;
                const cartaSeleccionada = data.find(c => c.id == cartaId);
                abrirModalPelicula(cartaSeleccionada);
            });
        });
        
        contenedorCatalogo.appendChild(container);
    }

    // Funciones del modal (nuevo)
    function abrirModalPelicula(carta) {
        let modal = document.getElementById('modal-pelicula');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-pelicula';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-contenido">
                    <span class="modal-cerrar">&times;</span>
                    <h2 class="text-white">${carta.titulo}</h2>
                    <div class="modal-cuerpo">
                        <div class="trailer-container">
                            <iframe width="100%" height="400" src="${carta.trailer}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div class="info-container text-white mt-3">
                            ${carta.genero ? `<p><strong>Género:</strong> ${carta.genero}</p>` : ''}
                            ${carta.año ? `<p><strong>Año:</strong> ${carta.año}</p>` : ''}
                            ${carta.duracion ? `<p><strong>Duración:</strong> ${carta.duracion}</p>` : ''}
                            ${carta.director ? `<p><strong>Director:</strong> ${carta.director}</p>` : ''}
                            ${carta.reparto ? `<p><strong>Reparto:</strong> ${carta.reparto}</p>` : ''}
                            ${carta.resumen ? `<p class="mt-2"><strong>Sinopsis:</strong> ${carta.resumen}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.modal-cerrar').addEventListener('click', cerrarModalPelicula);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) cerrarModalPelicula();
            });
        }

        modal.querySelector('h2').textContent = carta.titulo;
        modal.querySelector('iframe').src = carta.trailer;
        modal.querySelector('.info-container').innerHTML = `
            ${carta.genero ? `<p><strong>Género:</strong> ${carta.genero}</p>` : ''}
            ${carta.año ? `<p><strong>Año:</strong> ${carta.año}</p>` : ''}
            ${carta.duracion ? `<p><strong>Duración:</strong> ${carta.duracion}</p>` : ''}
            ${carta.director ? `<p><strong>Director:</strong> ${carta.director}</p>` : ''}
            ${carta.reparto ? `<p><strong>Reparto:</strong> ${carta.reparto}</p>` : ''}
            ${carta.resumen ? `<p class="mt-2"><strong>Sinopsis:</strong> ${carta.resumen}</p>` : ''}
        `;

        modal.style.display = 'block';
    }

    function cerrarModalPelicula() {
        const modal = document.getElementById('modal-pelicula');
        if (modal) {
            modal.style.display = 'none';
            const iframe = modal.querySelector('iframe');
            iframe.src = iframe.src;
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModalPelicula();
    });
});