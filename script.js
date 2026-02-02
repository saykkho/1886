// Variables globales
let carrito = [];
let productosDb = [];
let filtroActual = 'todos';
let usuario = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
  }

  if (closeMobileMenu && mobileMenu) {
    closeMobileMenu.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }

  cargarCarritoDelLocalStorage();
  cargarUsuarioDelLocalStorage();
  actualizarContadorCarrito();
  cargarProductos();
  inicializarEventos();
  actualizarUIUsuario();
});

// --- Gestión de Usuario ---

function obtenerUsuariosDb() {
  const users = localStorage.getItem('usuarios_db');
  return users ? JSON.parse(users) : [];
}

function registrarUsuario(email, password, nombre) {
  const usuariosDb = obtenerUsuariosDb();

  if (usuariosDb.some(u => u.email === email)) {
    return { exito: false, mensaje: 'Aquest correu ja està registrat.' };
  }

  const nuevoUsuario = {
    email,
    password, // En una app real, esto NUNCA se guardaría en texto plano
    nombre: nombre || email.split('@')[0],
    fechaRegistro: new Date().toISOString()
  };

  usuariosDb.push(nuevoUsuario);
  localStorage.setItem('usuarios_db', JSON.stringify(usuariosDb));

  return { exito: true, mensaje: 'Registre completat correctament!' };
}

function loguearUsuario(email, password) {
  const usuariosDb = obtenerUsuariosDb();
  const userEncontrado = usuariosDb.find(u => u.email === email && u.password === password);

  if (userEncontrado) {
    usuario = {
      email: userEncontrado.email,
      nombre: userEncontrado.nombre,
      fechaLogin: new Date().toISOString()
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));
    actualizarUIUsuario();
    return { exito: true };
  } else {
    return { exito: false, mensaje: 'Email o contrasenya incorrectes.' };
  }
}

function cargarUsuarioDelLocalStorage() {
  const userGuardado = localStorage.getItem('usuario');
  if (userGuardado) {
    usuario = JSON.parse(userGuardado);
  }
}

function cerrarSesion() {
  usuario = null;
  localStorage.removeItem('usuario');
  actualizarUIUsuario();
  mostrarNotificacion('Sessió tancada');
  if (window.location.pathname.includes('login.html')) {
    window.location.href = 'index.html';
  }
}

function actualizarUIUsuario() {
  // Encontrar el botón de cuenta buscando el icono 'person' dentro de él
  const icons = document.querySelectorAll('.material-symbols-outlined');
  let btnCuenta = null;

  icons.forEach(icon => {
    if (icon.textContent.trim() === 'person' || icon.textContent.trim() === 'account_circle') {
      btnCuenta = icon.parentElement;
    }
  });

  if (!btnCuenta) return;

  if (usuario) {
    // Usuario logueado: cambiar icono o añadir menú
    btnCuenta.innerHTML = `
      <div class="flex items-center gap-2 group relative">
        <span class="material-symbols-outlined text-primary">account_circle</span>
        <span class="text-[10px] font-bold uppercase hidden md:block">${usuario.nombre}</span>
        <!-- Menu desplegable simple -->
        <div class="absolute top-full right-0 mt-2 w-48 bg-card-dark border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 text-left">
          <p class="text-[10px] text-gray-500 p-2 border-b border-white/5 mb-1 truncate">${usuario.email}</p>
          <button onclick="cerrarSesion()" class="w-full text-left p-2 text-xs hover:bg-primary/20 rounded-md transition-colors flex items-center gap-2 text-white">
            <span class="material-symbols-outlined text-sm">logout</span> Tancar Sessió
          </button>
        </div>
      </div>
    `;
    // Quitar cualquier listener previo redirigiendo al click
    btnCuenta.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
  } else {
    // Usuario no logueado: restaurar botón original
    btnCuenta.innerHTML = `<span class="material-symbols-outlined">person</span>`;
    btnCuenta.onclick = () => window.location.href = 'login.html';
  }
}

// Cargar productos desde JSON
async function cargarProductos() {
  try {
    const response = await fetch('productos.json');
    const data = await response.json();
    productosDb = data.productos;
    renderizarProductos(productosDb);
  } catch (error) {
    console.error('Error carregant productes:', error);
  }
}

// Inicializar eventos
function inicializarEventos() {
  // Buscador - con listener mejorado
  const inputBusqueda = document.querySelector('input[placeholder*="BUSCAR"]');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', (e) => {
      filtrarProductos(e.target.value);
    });
  }

  // Botón carrito - buscar por el ícono shopping_bag
  const allButtons = document.querySelectorAll('header button');
  let btnCarrito = null;
  let btnCuenta = null;

  allButtons.forEach(btn => {
    const icon = btn.querySelector('.material-symbols-outlined');
    if (icon && icon.textContent.includes('shopping_bag')) {
      btnCarrito = btn;
    }
    if (icon && icon.textContent.includes('person')) {
      btnCuenta = btn;
    }
  });

  if (btnCarrito) {
    btnCarrito.addEventListener('click', mostrarCarrito);
  }

  // Toggle tema oscuro
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' && e.ctrlKey) {
      e.preventDefault();
      toggleTema();
    }
  });
}

// Renderizar productos
function renderizarProductos(productos) {
  const contenedor = document.querySelector('.flex.overflow-x-auto.gap-6.custom-scrollbar');
  if (!contenedor) return;

  contenedor.innerHTML = productos.map(producto => `
    <div onclick="mostrarCountdown(event)" class="min-w-[320px] group cursor-pointer">
      <div class="relative aspect-[3/4] bg-card-dark rounded-xl overflow-hidden mb-4">
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style='background-image: url("${producto.imagen}");'></div>
        ${producto.nuevo ? '<div class="absolute top-4 left-4"><span class="bg-primary text-[10px] font-black uppercase tracking-widest px-2 py-1">Nou</span></div>' : ''}
        <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/80 to-transparent">
          ${producto.textoPrecio
      ? '<span class="w-full block text-center text-white font-bold py-3 uppercase text-xs tracking-widest">Pròximament</span>'
      : `<button class="w-full bg-white text-black font-black py-3 uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-colors">Veure</button>`
    }
        </div>
      </div>
      <h3 class="font-bold text-lg">${producto.nombre}</h3>
      <div class="flex items-center gap-2">
        ${producto.textoPrecio
      ? `<p class="text-grana-accent font-bold">${producto.textoPrecio}</p>`
      : `<p class="text-grana-accent font-bold">€${producto.precio.toFixed(2)}</p>
             ${producto.precioOriginal ? `<p class="text-gray-500 text-sm line-through">€${producto.precioOriginal.toFixed(2)}</p>` : ''}`
    }
      </div>
    </div>
  `).join('');
}

// Función de Cuenta Atrás
function mostrarCountdown(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Eliminar cualquier overlay previo
  const existing = document.querySelector('.countdown-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'countdown-overlay';

  // Fecha objetivo: hoy + 7 días
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);

  overlay.innerHTML = `
    <div class="countdown-card">
      <span class="material-symbols-outlined text-primary text-5xl mb-4">lock_clock</span>
      <h2 class="text-2xl font-black uppercase tracking-tighter text-white">Pròxim Llançament</h2>
      <p class="text-gray-400 text-sm mt-2">Aquest producte estarà disponible molt aviat. Estigues atent!</p>
      
      <div class="countdown-timer" id="timer">
        <div class="countdown-unit"><span>06</span><span class="countdown-label">d</span></div>
        <div class="countdown-unit"><span>23</span><span class="countdown-label">h</span></div>
        <div class="countdown-unit"><span>59</span><span class="countdown-label">m</span></div>
        <div class="countdown-unit"><span>59</span><span class="countdown-label">s</span></div>
      </div>

      <button onclick="this.closest('.countdown-overlay').remove()" class="mt-4 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Tancar</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Lógica del timer real
  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const timerEl = document.getElementById('timer');
    if (timerEl) {
      timerEl.innerHTML = `
        <div class="countdown-unit"><span>${String(days).padStart(2, '0')}</span><span class="countdown-label">d</span></div>
        <div class="countdown-unit"><span>${String(hours).padStart(2, '0')}</span><span class="countdown-label">h</span></div>
        <div class="countdown-unit"><span>${String(minutes).padStart(2, '0')}</span><span class="countdown-label">m</span></div>
        <div class="countdown-unit"><span>${String(seconds).padStart(2, '0')}</span><span class="countdown-label">s</span></div>
      `;
    }

    if (distance < 0) {
      clearInterval(interval);
      if (timerEl) timerEl.innerHTML = "DISPONIBLE!";
    }
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      clearInterval(interval);
      overlay.remove();
    }
  });
}

// Filtrar productos por término de búsqueda
function filtrarProductos(termino) {
  const contenedorCarousel = document.querySelector('.flex.overflow-x-auto.gap-6.custom-scrollbar');
  const gridProductos = document.getElementById('productosGrid');

  if (!termino.trim()) {
    // Si está vacío, mostrar todos
    if (contenedorCarousel) {
      renderizarProductos(productosDb);
    }
    if (gridProductos) {
      // Para colección
      const categoria = document.querySelector('button.bg-primary')?.textContent || 'todos';
      if (categoria === 'Todos' || categoria === 'todos') {
        renderizarProductos(productosDb);
      } else {
        const filtrado = productosDb.filter(p => p.categoria === (categoria === 'Equipaciones' ? 'equipaciones' : categoria === 'Entrenamiento' ? 'entrenamiento' : 'accesorios'));
        renderizarProductos(filtrado);
      }
    }
    return;
  }

  const filtrado = productosDb.filter(p =>
    p.nombre.toLowerCase().includes(termino.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(termino.toLowerCase())
  );

  if (contenedorCarousel || gridProductos) {
    renderizarProductos(filtrado);
  }
}

// Agregar al carrito
function agregarAlCarrito(event, productoId) {
  event.preventDefault();
  event.stopPropagation();

  const producto = productosDb.find(p => p.id === productoId);
  if (!producto) return;

  const itemCarrito = carrito.find(item => item.id === productoId);
  if (itemCarrito) {
    itemCarrito.cantidad++;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }

  guardarCarritoEnLocalStorage();
  actualizarContadorCarrito();
  mostrarNotificacion(`${producto.nombre} afegit al carretó`);
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  // Buscar el badge de carrito (span con clase size-4 bg-primary dentro del botón de carrito)
  const badges = document.querySelectorAll('button span.absolute.top-0.right-0.size-4.bg-primary');
  badges.forEach(badge => {
    badge.textContent = total;
  });
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
  const notif = document.createElement('div');
  notif.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
  notif.textContent = mensaje;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 3000);
}

// Guardar carrito en localStorage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function cargarCarritoDelLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
}

// Mostrar carrito (Side Drawer)
function mostrarCarrito() {
  cargarCarritoDelLocalStorage();

  if (document.querySelector('.cart-overlay')) {
    cerrarCarrito();
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';

  const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2);
  const itemsHtml = carrito.length === 0
    ? '<div class="h-full flex flex-col items-center justify-center text-center p-8"><span class="material-symbols-outlined text-6xl text-gray-700 mb-4">shopping_cart_off</span><p class="text-gray-400">El teu carretó està buit</p></div>'
    : `
      <div class="space-y-6">
        ${carrito.map((item, index) => `
          <div class="flex gap-4 group">
            <div class="w-20 h-20 bg-background-dark rounded-lg overflow-hidden flex-shrink-0">
               <img src="${item.imagen}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h4 class="font-bold text-sm text-white">${item.nombre}</h4>
                <button onclick="eliminarDelCarrito(${index})" class="text-gray-500 hover:text-primary transition-colors">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <p class="text-xs text-grana-accent mt-1">€${item.precio.toFixed(2)}</p>
              <div class="flex items-center gap-3 mt-3">
                <span class="text-xs text-gray-500 italic">Quantitat: ${item.cantidad}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  overlay.innerHTML = `
    <div class="cart-drawer">
      <div class="cart-header">
        <div>
          <h2 class="text-xl font-black uppercase tracking-tighter">El Meu Carretó</h2>
          <p class="text-[10px] text-gray-500 uppercase tracking-widest">${carrito.length} articles</p>
        </div>
        <button onclick="cerrarCarrito()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div class="cart-body custom-scrollbar">
        ${itemsHtml}
      </div>

      ${carrito.length > 0 ? `
        <div class="cart-footer space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-400 uppercase text-xs font-bold tracking-widest">Total estimada</span>
            <span class="text-2xl font-black text-primary">€${totalPrecio}</span>
          </div>
          <button onclick="window.location.href='checkout.html'" 
            class="w-full bg-primary hover:bg-primary/80 text-white font-black py-4 rounded-lg uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
            Procedir a la revisió
          </button>
          <button onclick="cerrarCarrito()" class="w-full text-center text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors py-2">
            Continuar comprant
          </button>
        </div>
      ` : ''}
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) cerrarCarrito();
  });
}

function cerrarCarrito() {
  const overlay = document.querySelector('.cart-overlay');
  const drawer = document.querySelector('.cart-drawer');
  if (overlay && drawer) {
    drawer.classList.add('closing');
    overlay.style.backgroundColor = 'transparent';
    overlay.style.backdropFilter = 'none';

    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 400);
  }
}

// Eliminar del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarritoEnLocalStorage();
  actualizarContadorCarrito();

  // Cerrar y reabrir el carrito para actualizar sin animación de cierre para sensación de rapidez
  const overlay = document.querySelector('.cart-overlay');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
  mostrarCarrito();
}

// Mostrar cuenta (placeholder -> login)
function mostrarCuenta() {
  window.location.href = 'login.html';
}

// Toggle tema oscuro
function toggleTema() {
  document.documentElement.classList.toggle('dark');
}

// Función para desplazar carruseles
window.scrollCarousel = function (carouselId, direction) {
  const container = document.getElementById(carouselId);
  if (!container) return;

  // En móvil el scroll suele ser por elementos individuales o píxeles fijos
  const scrollAmount = container.offsetWidth * 0.8;
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
};

// Scroll suave para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Listener para cambios en el carrito
window.addEventListener('focus', () => {
  cargarCarritoDelLocalStorage();
  actualizarContadorCarrito();
});

// --- Lógica del Checkout ---

function cargarCheckout() {
  cargarCarritoDelLocalStorage();
  const contenedorItems = document.getElementById('checkout-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const totalEl = document.getElementById('checkout-total');
  const form = document.getElementById('checkoutForm');

  if (!contenedorItems) return; // No estamos en checkout.html

  if (carrito.length === 0) {
    contenedorItems.innerHTML = '<p class="text-gray-400 text-sm">El teu carretó està buit.</p>';
    if (subtotalEl) subtotalEl.textContent = '€0.00';
    if (totalEl) totalEl.textContent = '€0.00';
    return;
  }

  // Renderizar items
  contenedorItems.innerHTML = carrito.map(item => `
    <div class="flex gap-4 items-center">
      <div class="w-16 h-16 bg-card-dark rounded-lg overflow-hidden flex-shrink-0">
        <img src="${item.imagen}" class="w-full h-full object-cover">
      </div>
      <div class="flex-1">
        <p class="font-bold text-sm text-white">${item.nombre}</p>
        <p class="text-xs text-gray-400">Quantitat: ${item.cantidad}</p>
      </div>
      <p class="font-bold text-sm">€${(item.precio * item.cantidad).toFixed(2)}</p>
    </div>
  `).join('');

  // Totales
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  if (subtotalEl) subtotalEl.textContent = `€${total.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;
}
