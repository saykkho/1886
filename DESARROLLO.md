# Guía de Desarrollo - Nàstic Store

## 🚀 Instalación Local

1. **Descargar archivos**
   ```bash
   git clone [repositorio]
   cd 1186
   ```

2. **Servir localmente**
   - Opción 1: Usar VS Code Live Server
   - Opción 2: Python
     ```bash
     python -m http.server 8000
     ```
   - Opción 3: Node.js http-server
     ```bash
     npx http-server
     ```

3. **Abrir en navegador**
   ```
   http://localhost:8000
   ```

## 📁 Estructura del Proyecto

### Archivos Principales
- **index.html**: Página principal del store
- **contacto.html**: Página de contacto
- **script.js**: Lógica JavaScript (carrito, búsqueda, etc.)
- **styles.css**: Estilos personalizados
- **productos.json**: Base de datos de productos

### Carpetas
- **images/**: Imágenes de la página y productos
- **ROPA/**: (Opcional) Productos adicionales

## 🛠️ Funcionalidades Implementadas

### 1. Carrito de Compras
```javascript
// Agregar producto
agregarAlCarrito(id)

// Eliminar producto
eliminarDelCarrito(id)

// Actualizar contador
actualizarContadorCarrito()

// Persistencia
localStorage.setItem('carrito', JSON.stringify(carrito))
```

### 2. Búsqueda y Filtrado
```javascript
// Buscar productos
filtrarProductos(termino)

// Por categoría
filtrarPorCategoria(categoria)
```

### 3. Gestión de Productos
```javascript
// Cargar desde JSON
cargarProductos()

// Renderizar dinámicamente
renderizarProductos(productos)
```

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**:
  - 640px: tablets
  - 1024px: desktop
  - 1280px: pantallas grandes

## 🎨 Personalización

### Colores
```css
--primary: #94000c       /* Rojo grana principal */
--grana-accent: #ce8d92  /* Tono más claro */
--background-dark: #121212
--card-dark: #1F1F1F
```

### Tipografía
- Fuente principal: "Epilogue" (Google Fonts)
- Iconos: Material Symbols

## 🔐 Seguridad

- Datos almacenados en localStorage (lado del cliente)
- No se envían datos sensibles al servidor
- HTTPS recomendado para producción

## ⚡ Optimización

- Lazy loading de imágenes
- Animaciones CSS en lugar de JavaScript
- Compresión de imágenes recomendada
- Cache del navegador habilitado

## 🚀 Despliegue

### GitHub Pages
```bash
git push origin main
# Ir a Settings > Pages > Source: main
```

### Netlify
1. Conectar repositorio
2. Build command: (dejar vacío)
3. Deploy

### Vercel
```bash
vercel deploy
```

## 📊 Analytics (Opcional)

Agregar Google Analytics:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

## 🔄 Actualizaciones Futuras

1. **Backend**
   - Node.js + Express
   - Base de datos (MongoDB/PostgreSQL)
   - API REST

2. **Autenticación**
   - Login/Registro
   - JWT tokens
   - Perfil de usuario

3. **Pagos**
   - Stripe integration
   - PayPal integration
   - Transferencia bancaria

4. **Inventario**
   - Panel de administración
   - Gestión de stock
   - Reportes

5. **Mejoras UX**
   - Wishlist
   - Reviews
   - Chat en vivo
   - Recomendaciones

## 🐛 Resolución de Problemas

### El carrito no se guarda
- Verificar localStorage habilitado
- Revisar consola de navegador (F12)

### Las imágenes no cargan
- Verificar rutas relativas
- Comprobar que el archivo existe

### Script.js no funciona
- Asegurar que se carga después del DOM
- Revisar errores en consola

## 📚 Recursos

- [MDN Web Docs](https://developer.mozilla.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JavaScript.info](https://javascript.info/)

## 📞 Soporte

Para soporte técnico:
- Email: dev@nasticdetarragona.com
- Issues: GitHub repository
- Discord: [Comunidad Nàstic]

---

**Última actualización**: Enero 2026
**Versión**: 1.0.0
