// Elementos del DOM
const btnCargarNasa = document.getElementById('btn-cargar-nasa');
const resultadoApi = document.getElementById('resultado-api');
const tituloReflexion = document.getElementById('titulo-reflexion');
const textoReflexion = document.getElementById('texto-reflexion');
const btnGuardarReflexion = document.getElementById('btn-guardar-reflexion');
const listaReflexiones = document.getElementById('lista-reflexiones');

// API de NASA (imágenes de planetas, sin clave)
const NASA_API_URL = 'https://images-api.nasa.gov/search?q=planets&media_type=image';

// Evento para cargar imagen
btnCargarNasa.addEventListener('click', cargarImagenNasa);

// Función asíncrona para consumir la API
async function cargarImagenNasa() {
    mostrarMensajeCargando();
    btnCargarNasa.disabled = true;
    btnCargarNasa.innerText = '⏳ Cargando...';

    try {
        const respuesta = await fetch(NASA_API_URL);
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);
        const datos = await respuesta.json();
        mostrarDatosEnDOM(datos);
    } catch (error) {
        mostrarMensajeError();
    } finally {
        btnCargarNasa.disabled = false;
        btnCargarNasa.innerText = '🔭 Cargar Otra Imagen';
    }
}

// Mostrar mensaje de carga
function mostrarMensajeCargando() {
    resultadoApi.innerHTML = '<div class="loading-message"><p>🔄 Cargando imagen del espacio...</p><p>Por favor espera ✨</p></div>';
}

// Mostrar mensaje de error
function mostrarMensajeError() {
    resultadoApi.innerHTML = '<div class="error-message"><h3>❌ Error al cargar los datos</h3><p>No se pudieron cargar los datos de la NASA.</p><p>Por favor, intenta más tarde.</p></div>';
}

// Mostrar datos en el DOM (selecciona imagen aleatoria)
function mostrarDatosEnDOM(datos) {
    resultadoApi.innerHTML = '';
    if (!datos.collection || datos.collection.items.length === 0) {
        mostrarMensajeError();
        return;
    }

    const items = datos.collection.items;
    const item = items[Math.floor(Math.random() * items.length)]; // Aleatorio
    const titulo = item.data[0].title || 'Imagen del Universo';
    const fecha = item.data[0].date_created ? new Date(item.data[0].date_created).toLocaleDateString('es-ES') : 'Fecha desconocida';
    const urlImagen = item.links[0].href;
    const descripcion = item.data[0].description || 'Descripción no disponible.';

    const contenedor = document.createElement('div');
    contenedor.className = 'api-content';

    contenedor.innerHTML = `
        <h2 class="api-title">${titulo}</h2>
        <p class="api-date">📅 Fecha: ${fecha}</p>
        <img class="api-image" src="${urlImagen}" alt="${titulo}" onerror="this.src='https://via.placeholder.com/800x600/667eea/ffffff?text=Imagen+del+Espacio'">
        <div class="api-description"><h3>📖 Explicación:</h3><p>${descripcion}</p></div>
    `;

    resultadoApi.appendChild(contenedor);
}

// Evento para guardar reflexión
btnGuardarReflexion.addEventListener('click', guardarReflexion);

// Guardar reflexión en LocalStorage
function guardarReflexion() {
    const titulo = tituloReflexion.value.trim();
    const texto = textoReflexion.value.trim();
    if (!titulo || !texto) {
        alert('⚠️ Por favor completa el título y el texto de tu reflexión');
        return;
    }

    const reflexion = {
        id: Date.now(),
        titulo,
        texto,
        fecha: new Date().toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const reflexiones = [reflexion, ...obtenerReflexionesLocalStorage()];
    localStorage.setItem('reflexiones-espaciales', JSON.stringify(reflexiones));
    tituloReflexion.value = '';
    textoReflexion.value = '';
    mostrarReflexiones();
}

// Mostrar reflexiones guardadas
function mostrarReflexiones() {
    const reflexiones = obtenerReflexionesLocalStorage();
    listaReflexiones.innerHTML = reflexiones.length === 0
        ? '<p class="mensaje-vacio">No hay reflexiones aún. ¡Escribe tu primera reflexión sobre el universo! 🌌</p>'
        : reflexiones.map(reflexion => `
            <div class="reflexion-card">
                <div class="reflexion-header">
                    <h4 class="reflexion-titulo">${reflexion.titulo}</h4>
                    <span class="reflexion-fecha">${reflexion.fecha}</span>
                </div>
                <p class="reflexion-texto">${reflexion.texto}</p>
                <button class="btn-eliminar" onclick="eliminarReflexion(${reflexion.id})">🗑️ Eliminar</button>
            </div>
        `).join('');
}

// Eliminar reflexión
function eliminarReflexion(id) {
    if (!confirm('¿Estás seguro de eliminar esta reflexión?')) return;
    const reflexiones = obtenerReflexionesLocalStorage().filter(r => r.id !== id);
    localStorage.setItem('reflexiones-espaciales', JSON.stringify(reflexiones));
    mostrarReflexiones();
}

// Obtener reflexiones de LocalStorage
function obtenerReflexionesLocalStorage() {
    return JSON.parse(localStorage.getItem('reflexiones-espaciales') || '[]');
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', mostrarReflexiones);
