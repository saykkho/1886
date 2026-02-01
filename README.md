# Gimnàstic de Tarragona Store - Funcionalidades

## Características Implementadas

### ✅ Funcionales
- **Catálogo de Productos**: Base de datos JSON con 6 productos iniciales
- **Carrito de Compras**: Agregar/eliminar productos, persistencia en localStorage
- **Buscador**: Filtrar productos por nombre y descripción
- **Responsive Design**: Optimizado para móvil, tablet y desktop
- **Tema Oscuro/Claro**: Toggle automático (Ctrl+T)
- **Notificaciones**: Feedback visual al añadir al carrito
- **Contador de Carrito**: Actualización en tiempo real

### 📱 Características de Usuario
- Interfaz intuitiva y moderna
- Animaciones suaves
- Navegación fácil
- Información clara de productos
- Sistema de categorías

## Estructura de Archivos

```
1186/
├── index.html          # HTML principal
├── script.js          # JavaScript (funcionalidad)
├── styles.css         # CSS personalizado
├── productos.json     # Base de datos de productos
├── images/           # Carpeta de imágenes
│   ├── image.png
│   ├── camiseta-doble.jpeg
│   ├── estadio-front.jpeg
│   └── estadio.jpeg
└── README.md          # Este archivo
```

## Cómo Usar

### Añadir Productos al Carrito
1. Busca el producto
2. Haz clic en "Añadir"
3. Se guardará automáticamente en tu carrito

### Ver Carrito
Haz clic en el icono de bolsa de compras (🛍️) en la esquina superior derecha

### Búsqueda
Usa la barra de búsqueda para filtrar productos por nombre o descripción

### Cambiar Tema
Presiona `Ctrl+T` para cambiar entre modo oscuro y claro

## API de Productos

### Estructura de Producto
```json
{
  "id": 1,
  "nombre": "Nombre del Producto",
  "categoria": "equipaciones|entrenamiento|accesorios",
  "precio": 79.99,
  "imagen": "ruta/a/imagen.jpg",
  "descripcion": "Descripción del producto",
  "tallas": ["S", "M", "L"],
  "stock": 50,
  "nuevo": true
}
```

## Próximas Funcionalidades

- [ ] Sistema de login/registro
- [ ] Wishlist/Favoritos
- [ ] Filtro avanzado por categoría, precio, talla
- [ ] Sistema de pagos integrado
- [ ] Historial de pedidos
- [ ] Reseñas y calificaciones
- [ ] Chat de soporte
- [ ] Newsletter
- [ ] Ofertas y descuentos
- [ ] Envíos y costos de envío

## Soporte

Para más información sobre el Club Gimnàstic de Tarragona, visita:
- Sitio oficial: https://www.nasticdetarragona.com
- Redes sociales: @nasticdetarragona

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2026  
**Desarrollador**: Nàstic Store Team
